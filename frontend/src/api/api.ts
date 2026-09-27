import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ListResult } from 'pocketbase'
import { getErrorMessage, shrinkImage, toPeriodStart, type PostSort } from '~/utils'
import {
  commentsCollection,
  groupsCollection,
  likesCollection,
  membershipsCollection,
  pb,
  postsCollection,
  reportsCollection,
  usersCollection,
} from './pocketbase'
import type {
  ChangePasswordInput,
  Comment,
  CreateCommentInput,
  CreateGroupInput,
  CreatePostInput,
  FeedPost,
  FriendInput,
  Group,
  JoinGroupInput,
  Like,
  LikeInput,
  LoginInput,
  Membership,
  Post,
  PostsFilter,
  PostsQuery,
  RegisterInput,
  ReportPostInput,
  UnlikeInput,
  UpdateGroupImageInput,
  UpdatePostInput,
  UpdateUserInput,
  User,
  UserProfile,
} from './types'

// Every endpoint talks to PocketBase through its SDK instead of a URL, so errors are caught here
// and handed to RTK Query as plain strings.
const request = async <Data>(
  send: () => Promise<Data>,
): Promise<{ data: Data } | { error: string }> => {
  try {
    return { data: await send() }
  } catch (error) {
    return { error: getErrorMessage(error) }
  }
}

const pageSize = 20
const commentPageSize = 10

// skipTotal saves PocketBase a COUNT query per page, so a short page is the only sign of the end.
const toPageOptions = (size: number) => ({
  initialPageParam: 1,
  getNextPageParam: ({ items, page }: ListResult<unknown>) =>
    items.length < size ? undefined : page + 1,
})
const pageOptions = toPageOptions(pageSize)

// Looks up the friend and group ids first and matches them as plain columns. The back-relation form
// (`author.users_via_friends.id ?= me || group.memberships_via_group.user ?= me`) joins per post, so
// any sort other than newest-first had to check every post: 20s at 6k posts, against milliseconds.
const toHomeFilter = async (userId: string) => {
  const [{ friends }, memberships] = await Promise.all([
    usersCollection.getOne<Pick<User, 'friends'>>(userId, { fields: 'friends' }),
    membershipsCollection.getFullList<Pick<Membership, 'group'>>({
      filter: pb.filter('user = {:userId}', { userId }),
      fields: 'group',
    }),
  ])
  return toFollowingFilter(
    [userId, ...friends],
    memberships.map(({ group }) => group),
  )
}

// Plain column matches, one per id: see toHomeFilter for why not a back-relation.
const toFollowingFilter = (authorIds: string[], groupIds: string[]) => {
  const params: Record<string, string> = {}
  const clauses: string[] = []
  authorIds.forEach((authorId, index) => {
    params[`author${index}`] = authorId
    clauses.push(`author = {:author${index}}`)
  })
  groupIds.forEach((groupId, index) => {
    params[`group${index}`] = groupId
    clauses.push(`group = {:group${index}}`)
  })
  // Following nobody matches nothing (an empty filter would match everything).
  return clauses.length === 0 ? "id = ''" : pb.filter(clauses.join(' || '), params)
}

const toIdFilter = (ids: string[]) =>
  ids.length === 0
    ? "id = ''"
    : pb.filter(
        ids.map((_id, index) => `id = {:id${index}}`).join(' || '),
        Object.fromEntries(ids.map((id, index) => [`id${index}`, id])),
      )

const toPostsFilter = async (postsFilter: PostsFilter) => {
  switch (postsFilter.kind) {
    case 'home':
      return toHomeFilter(postsFilter.userId)
    case 'author':
      return pb.filter('author = {:authorId}', { authorId: postsFilter.authorId })
    case 'group':
      return pb.filter('group = {:groupId}', { groupId: postsFilter.groupId })
    case 'following':
      return toFollowingFilter(postsFilter.userIds, postsFilter.groupIds)
    case 'everyone':
      return ''
  }
}

const postSortFields: Record<PostSort, string> = {
  new: '-created',
  likes: '-likes,-created',
  comments: '-comments,-created',
}

// The window starts when the page is fetched, so it isn't part of the cache key: a refetch moves it.
const toPostsQueryFilter = async ({ filter, period }: PostsQuery) => {
  const since = toPeriodStart(period)
  const base = await toPostsFilter(filter)
  if (since === undefined) {
    return base
  }
  const periodFilter = pb.filter('created >= {:since}', { since })
  return base === '' ? periodFilter : `(${base}) && ${periodFilter}`
}

// Only what the UI shows. Without this every author in a feed drags along their whole friends list.
const toExpandFields = (relation: string, fields: string[]) =>
  fields.map((field) => `expand.${relation}.${field}`).join(',')
const fileOwnerFields = ['id', 'collectionId', 'collectionName']
const userSummaryFields = [...fileOwnerFields, 'name', 'avatar']
const userProfileFields = [...userSummaryFields, 'bio'].join(',')
const postFields = [
  '*',
  toExpandFields('author', userSummaryFields),
  toExpandFields('group', [...fileOwnerFields, 'name']),
].join(',')
const commentFields = ['*', toExpandFields('author', userSummaryFields)].join(',')

const getAuthenticatedUserId = () => {
  const userId = pb.authStore.record?.id
  if (userId === undefined) {
    throw new Error('Not logged in')
  }
  return userId
}

// One small request per page instead of expanding every like of every post.
const withOwnLikes = async (page: ListResult<Post>): Promise<ListResult<FeedPost>> => {
  // Visitors have no likes of their own.
  if (page.items.length === 0 || pb.authStore.record === null) {
    return page
  }
  const postIds = Object.fromEntries(page.items.map(({ id }, index) => [`post${index}`, id]))
  const ownLikes = await likesCollection.getFullList({
    filter: pb.filter(
      `user = {:userId} && (${Object.keys(postIds)
        .map((key) => `post = {:${key}}`)
        .join(' || ')})`,
      { userId: getAuthenticatedUserId(), ...postIds },
    ),
    fields: 'id,post',
  })
  const ownLikeIdByPost = new Map(ownLikes.map(({ id, post }) => [post, id]))
  return {
    ...page,
    items: page.items.map((post) => ({ ...post, ownLikeId: ownLikeIdByPost.get(post.id) })),
  }
}

// Patch the post in every cached feed instead of refetching every loaded page of every feed.
const patchCachedPost = (
  dispatch: (action: ReturnType<typeof api.util.updateQueryData>) => unknown,
  getState: () => Parameters<typeof api.util.selectInvalidatedBy>[0],
  postId: string,
  recipe: (post: FeedPost) => void,
) => {
  const entries = api.util.selectInvalidatedBy(getState(), ['Post'])
  for (const { endpointName, originalArgs } of entries) {
    if (endpointName !== 'getPosts') {
      continue
    }
    dispatch(
      api.util.updateQueryData('getPosts', originalArgs, (data) => {
        for (const page of data.pages) {
          const post = page.items.find(({ id }) => id === postId)
          if (post) {
            recipe(post)
          }
        }
      }),
    )
  }
}

const getAuthenticatedEmail = () => {
  const email: unknown = pb.authStore.record?.email
  if (typeof email !== 'string') {
    throw new Error('Not logged in')
  }
  return email
}

export const api = createApi({
  baseQuery: fakeBaseQuery<string>(),
  tagTypes: ['User', 'Group', 'Membership', 'Post', 'Comment'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation<User, LoginInput>({
      queryFn: ({ email, password }) =>
        request(async () => (await usersCollection.authWithPassword(email, password)).record),
    }),
    register: builder.mutation<User, RegisterInput>({
      queryFn: ({ name, email, password, turnstileToken }) =>
        request(async () => {
          // PocketBase emails the confirmation link itself (pb_hooks/spam.pb.js).
          await usersCollection.create({
            name,
            email,
            password,
            passwordConfirm: password,
            turnstileToken,
          })
          return (await usersCollection.authWithPassword(email, password)).record
        }),
    }),
    requestVerification: builder.mutation<boolean, void>({
      queryFn: () => request(() => usersCollection.requestVerification(getAuthenticatedEmail())),
    }),
    requestPasswordReset: builder.mutation<boolean, string>({
      queryFn: (email) => request(() => usersCollection.requestPasswordReset(email)),
    }),
    changePassword: builder.mutation<User, ChangePasswordInput>({
      queryFn: ({ userId, oldPassword, password }) =>
        request(async () => {
          const email = getAuthenticatedEmail()
          await usersCollection.update(userId, { oldPassword, password, passwordConfirm: password })
          // Changing the password revokes every token, including this one.
          return (await usersCollection.authWithPassword(email, password)).record
        }),
    }),
    deleteAccount: builder.mutation<boolean, string>({
      queryFn: (userId) => request(() => usersCollection.delete(userId)),
    }),

    // Users & friends
    getUser: builder.query<UserProfile, string>({
      queryFn: (userId) =>
        request<UserProfile>(() => usersCollection.getOne(userId, { fields: userProfileFields })),
      providesTags: ['User'],
    }),
    // A visitor's followed people, from the ids kept in their browser.
    getUsersByIds: builder.infiniteQuery<ListResult<UserProfile>, string[], number>({
      infiniteQueryOptions: pageOptions,
      queryFn: ({ queryArg: userIds, pageParam }) =>
        request(() =>
          usersCollection.getList(pageParam, pageSize, {
            filter: toIdFilter(userIds),
            sort: 'name',
            skipTotal: true,
            fields: userProfileFields,
          }),
        ),
      providesTags: ['User'],
    }),
    searchUsers: builder.infiniteQuery<ListResult<UserProfile>, string, number>({
      infiniteQueryOptions: pageOptions,
      queryFn: ({ queryArg: query, pageParam }) =>
        request(() =>
          usersCollection.getList(pageParam, pageSize, {
            filter: pb.filter('name ~ {:query}', { query }),
            sort: 'name',
            skipTotal: true,
            fields: userProfileFields,
          }),
        ),
      providesTags: ['User'],
    }),
    getFriends: builder.infiniteQuery<ListResult<UserProfile>, string, number>({
      infiniteQueryOptions: pageOptions,
      queryFn: ({ queryArg: userId, pageParam }) =>
        request(() =>
          usersCollection.getList(pageParam, pageSize, {
            filter: pb.filter('users_via_friends.id ?= {:userId}', { userId }),
            sort: 'name',
            skipTotal: true,
            fields: userProfileFields,
          }),
        ),
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User, UpdateUserInput>({
      queryFn: ({ userId, avatar, ...changes }) =>
        request(async () =>
          usersCollection.update<User>(userId, {
            ...changes,
            avatar: avatar && (await shrinkImage(avatar)),
          }),
        ),
      invalidatesTags: ['User', 'Post'],
    }),
    addFriend: builder.mutation<User, FriendInput>({
      queryFn: ({ userId, friendId }) =>
        request<User>(() => usersCollection.update(userId, { 'friends+': friendId })),
      invalidatesTags: ['User', 'Post'],
    }),
    removeFriend: builder.mutation<User, FriendInput>({
      queryFn: ({ userId, friendId }) =>
        request<User>(() => usersCollection.update(userId, { 'friends-': friendId })),
      invalidatesTags: ['User', 'Post'],
    }),

    // Groups
    getGroups: builder.infiniteQuery<ListResult<Group>, string, number>({
      infiniteQueryOptions: pageOptions,
      queryFn: ({ queryArg: query, pageParam }) =>
        request(() =>
          groupsCollection.getList(pageParam, pageSize, {
            filter: query === '' ? undefined : pb.filter('name ~ {:query}', { query }),
            sort: 'name',
            skipTotal: true,
          }),
        ),
      providesTags: ['Group'],
    }),
    // A visitor's followed groups, from the ids kept in their browser.
    getGroupsByIds: builder.query<Group[], string[]>({
      queryFn: (groupIds) =>
        request(() =>
          groupsCollection.getFullList<Group>({ filter: toIdFilter(groupIds), sort: 'name' }),
        ),
      providesTags: ['Group'],
    }),
    getGroup: builder.query<Group, string>({
      queryFn: (groupId) => request<Group>(() => groupsCollection.getOne(groupId)),
      providesTags: ['Group'],
    }),
    createGroup: builder.mutation<Group, CreateGroupInput>({
      queryFn: ({ userId, name, image }) =>
        request(async () => {
          const group = await groupsCollection.create<Group>({
            name,
            image: image && (await shrinkImage(image)),
          })
          await membershipsCollection.create({ user: userId, group: group.id })
          return group
        }),
      invalidatesTags: ['Group', 'Membership'],
    }),
    updateGroupImage: builder.mutation<Group, UpdateGroupImageInput>({
      queryFn: ({ groupId, image }) =>
        request(async () =>
          groupsCollection.update<Group>(groupId, { image: await shrinkImage(image) }),
        ),
      invalidatesTags: ['Group'],
    }),
    getMemberships: builder.query<Membership[], string>({
      queryFn: (userId) =>
        request(() =>
          membershipsCollection.getFullList({
            filter: pb.filter('user = {:userId}', { userId }),
            sort: 'group.name',
            expand: 'group',
            fields: ['*', toExpandFields('group', [...fileOwnerFields, 'name'])].join(','),
          }),
        ),
      providesTags: ['Membership'],
    }),
    joinGroup: builder.mutation<Membership, JoinGroupInput>({
      queryFn: ({ userId, groupId }) =>
        request<Membership>(() => membershipsCollection.create({ user: userId, group: groupId })),
      invalidatesTags: ['Membership', 'Post'],
    }),
    leaveGroup: builder.mutation<boolean, string>({
      queryFn: (membershipId) => request(() => membershipsCollection.delete(membershipId)),
      invalidatesTags: ['Membership', 'Post'],
    }),

    // Posts
    getPosts: builder.infiniteQuery<ListResult<FeedPost>, PostsQuery, number>({
      infiniteQueryOptions: pageOptions,
      queryFn: ({ queryArg: postsQuery, pageParam }) =>
        request(async () =>
          withOwnLikes(
            await postsCollection.getList(pageParam, pageSize, {
              sort: postSortFields[postsQuery.sort],
              expand: 'author,group',
              filter: await toPostsQueryFilter(postsQuery),
              skipTotal: true,
              fields: postFields,
            }),
          ),
        ),
      providesTags: ['Post'],
    }),
    createPost: builder.mutation<Post, CreatePostInput>({
      queryFn: ({ authorId, content, groupId }) =>
        request<Post>(() => postsCollection.create({ author: authorId, content, group: groupId })),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation<Post, UpdatePostInput>({
      queryFn: ({ postId, content }) =>
        request<Post>(() => postsCollection.update(postId, { content }, { fields: 'content' })),
      onQueryStarted: async ({ postId }, { dispatch, getState, queryFulfilled }) => {
        const { data } = await queryFulfilled
        patchCachedPost(dispatch, getState, postId, (post) => {
          post.content = data.content
        })
      },
    }),
    likePost: builder.mutation<Like, LikeInput>({
      queryFn: ({ postId, userId }) =>
        request<Like>(() =>
          likesCollection.create({ post: postId, user: userId }, { fields: 'id' }),
        ),
      onQueryStarted: async ({ postId }, { dispatch, getState, queryFulfilled }) => {
        const { data } = await queryFulfilled
        patchCachedPost(dispatch, getState, postId, (post) => {
          post.likes += 1
          post.ownLikeId = data.id
        })
      },
    }),
    unlikePost: builder.mutation<boolean, UnlikeInput>({
      queryFn: ({ likeId }) => request(() => likesCollection.delete(likeId)),
      onQueryStarted: async ({ postId }, { dispatch, getState, queryFulfilled }) => {
        await queryFulfilled
        patchCachedPost(dispatch, getState, postId, (post) => {
          post.likes = Math.max(post.likes - 1, 0)
          post.ownLikeId = undefined
        })
      },
    }),
    reportPost: builder.mutation<boolean, ReportPostInput>({
      queryFn: ({ postId, reporterId }) =>
        request(async () => {
          await reportsCollection.create({ post: postId, reporter: reporterId }, { fields: 'id' })
          return true
        }),
    }),
    getComments: builder.infiniteQuery<ListResult<Comment>, string, number>({
      infiniteQueryOptions: toPageOptions(commentPageSize),
      queryFn: ({ queryArg: postId, pageParam }) =>
        request(() =>
          commentsCollection.getList(pageParam, commentPageSize, {
            filter: pb.filter('post = {:postId}', { postId }),
            sort: 'created',
            expand: 'author',
            skipTotal: true,
            fields: commentFields,
          }),
        ),
      providesTags: (_result, _error, postId) => [{ type: 'Comment', id: postId }],
    }),
    createComment: builder.mutation<boolean, CreateCommentInput>({
      queryFn: ({ postId, authorId, content }) =>
        request(async () => {
          await commentsCollection.create(
            { post: postId, author: authorId, content },
            { fields: 'id' },
          )
          return true
        }),
      invalidatesTags: (_result, _error, { postId }) => [{ type: 'Comment', id: postId }],
      onQueryStarted: async ({ postId }, { dispatch, getState, queryFulfilled }) => {
        await queryFulfilled
        patchCachedPost(dispatch, getState, postId, (post) => {
          post.comments += 1
        })
      },
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestVerificationMutation,
  useRequestPasswordResetMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetUserQuery,
  useGetUsersByIdsInfiniteQuery,
  useSearchUsersInfiniteQuery,
  useGetFriendsInfiniteQuery,
  useUpdateUserMutation,
  useAddFriendMutation,
  useRemoveFriendMutation,
  useGetGroupsInfiniteQuery,
  useGetGroupsByIdsQuery,
  useGetGroupQuery,
  useCreateGroupMutation,
  useUpdateGroupImageMutation,
  useGetMembershipsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useGetPostsInfiniteQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useReportPostMutation,
  useGetCommentsInfiniteQuery,
  useCreateCommentMutation,
} = api
