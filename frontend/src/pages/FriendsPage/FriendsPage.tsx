import { skipToken } from '@reduxjs/toolkit/query'
import { useSearchParams } from 'react-router'
import {
  useGetFriendsInfiniteQuery,
  useGetUsersByIdsInfiniteQuery,
  useSearchUsersInfiniteQuery,
  type UserProfile,
} from '~/api'
import {
  Heading,
  List,
  Page,
  PageHeader,
  QueryStatus,
  SearchBar,
  Stack,
  Text,
  UserCard,
} from '~/components'
import { FriendButton } from '~/features'
import { useCurrentUser, useGuestFollows } from '~/hooks'
import { flattenPages } from '~/utils'

const renderUser = (user: UserProfile) => (
  <UserCard user={user} actions={<FriendButton friendId={user.id} />} />
)

export const FriendsPage = () => {
  const user = useCurrentUser()
  const { userIds: followedIds } = useGuestFollows()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const isSearching = query !== ''
  // Members have friends; a visitor follows people, kept in their browser.
  const isGuest = user === undefined

  const friendsResult = useGetFriendsInfiniteQuery(user && !isSearching ? user.id : skipToken)
  const followedResult = useGetUsersByIdsInfiniteQuery(
    isGuest && !isSearching ? followedIds : skipToken,
  )
  const searchResult = useSearchUsersInfiniteQuery(query, { skip: !isSearching })
  let result = isGuest ? followedResult : friendsResult
  if (isSearching) {
    result = searchResult
  }
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = result
  const users = flattenPages(data)
  const count = user ? user.friends.length : followedIds.length
  const noun = isGuest ? 'following' : 'friends'
  let listTitle = isGuest ? 'people you follow' : 'my friends'
  if (isSearching) {
    listTitle = `results for "${query}"`
  }

  const handleSearch = (nextQuery: string) =>
    setSearchParams(nextQuery === '' ? {} : { q: nextQuery })
  const handleLoadMore = () => fetchNextPage()

  return (
    <Page>
      <PageHeader title={`~/${noun}`}>
        <Text size="small" tone="muted">
          {isGuest && `${count} in this browser`}
          {!isGuest && (count === 1 ? '1 friend' : `${count} friends`)}
        </Text>
      </PageHeader>
      <SearchBar label="Search people" defaultValue={query} onSearch={handleSearch} />
      <Stack as="section" gap="medium">
        <Heading level={2}>{listTitle}</Heading>
        <QueryStatus isLoading={isLoading} error={error} />
        {users && (
          <List
            items={users}
            loadMore={{
              hasMore: hasNextPage,
              isLoading: isFetchingNextPage,
              onLoadMore: handleLoadMore,
              isAutomatic: true,
            }}
            renderItem={renderUser}
            emptyText={
              isSearching
                ? `nobody matches "${query}". try part of a name.`
                : `${isGuest ? 'not following anyone' : 'no friends'} yet. search for someone above.`
            }
          />
        )}
      </Stack>
    </Page>
  )
}
