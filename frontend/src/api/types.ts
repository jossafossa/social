import type { RecordModel } from 'pocketbase'
import type { PostPeriod, PostSort } from '~/utils'

export type User = RecordModel & {
  email: string
  verified: boolean
  name: string
  bio: string
  avatar: string
  friends: string[]
}

export type Group = RecordModel & {
  name: string
  image: string
}

// What other users' records are trimmed to via `fields`: never their friends list.
export type UserProfile = Pick<
  User,
  'id' | 'collectionId' | 'collectionName' | 'name' | 'bio' | 'avatar'
>
export type UserSummary = Omit<UserProfile, 'bio'>
export type GroupSummary = Pick<Group, 'id' | 'collectionId' | 'collectionName' | 'name'>
export type FileOwner = Pick<RecordModel, 'id' | 'collectionId' | 'collectionName'>

export type Membership = RecordModel & {
  user: string
  group: string
  expand?: { group?: GroupSummary }
}

export type Like = RecordModel & {
  post: string
  user: string
}

export type Report = RecordModel & {
  post: string
  reporter: string
}

export type Comment = RecordModel & {
  post: string
  author: string
  content: string
  created: string
  expand?: { author?: UserSummary }
}

export type Post = RecordModel & {
  author: string
  group: string
  content: string
  created: string
  likes: number
  comments: number
  expand?: {
    author?: UserSummary
    group?: GroupSummary
  }
}

export type FeedPost = Post & {
  ownLikeId?: string
}

export type PostsFilter =
  | { kind: 'home'; userId: string }
  | { kind: 'author'; authorId: string }
  | { kind: 'group'; groupId: string }
  // A visitor's own follow list, kept in their browser.
  | { kind: 'following'; userIds: string[]; groupIds: string[] }
  // A visitor who follows nobody yet: every post.
  | { kind: 'everyone' }

export type PostsQuery = {
  filter: PostsFilter
  sort: PostSort
  period: PostPeriod
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = LoginInput & {
  name: string
  turnstileToken?: string
}

export type ReportPostInput = {
  postId: string
  reporterId: string
}

export type UpdateUserInput = {
  userId: string
  name?: string
  bio?: string
  avatar?: File
}

export type ChangePasswordInput = {
  userId: string
  oldPassword: string
  password: string
}

export type FriendInput = {
  userId: string
  friendId: string
}

export type CreateGroupInput = {
  userId: string
  name: string
  image?: File
}

export type JoinGroupInput = {
  userId: string
  groupId: string
}

export type CreatePostInput = {
  authorId: string
  content: string
  groupId?: string
}

export type UpdatePostInput = {
  postId: string
  content: string
}

export type LikeInput = {
  postId: string
  userId: string
}

export type UnlikeInput = {
  postId: string
  likeId: string
}

export type CreateCommentInput = {
  postId: string
  authorId: string
  content: string
}

export type UpdateGroupImageInput = {
  groupId: string
  image: File
}
