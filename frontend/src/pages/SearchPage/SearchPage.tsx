import { useSearchParams } from 'react-router'
import {
  useGetGroupsInfiniteQuery,
  useSearchUsersInfiniteQuery,
  type Group,
  type UserProfile,
} from '~/api'
import {
  EmptyState,
  Heading,
  List,
  Page,
  PageHeader,
  QueryStatus,
  SearchBar,
  Stack,
  UserCard,
} from '~/components'
import { FriendButton, GroupItem } from '~/features'
import { flattenPages } from '~/utils'

const renderUser = (user: UserProfile) => (
  <UserCard user={user} actions={<FriendButton friendId={user.id} />} />
)
const renderGroup = (group: Group) => <GroupItem group={group} />

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const isSearching = query !== ''

  const people = useSearchUsersInfiniteQuery(query, { skip: !isSearching })
  const groups = useGetGroupsInfiniteQuery(query, { skip: !isSearching })
  const users = flattenPages(people.data)
  const groupItems = flattenPages(groups.data)

  const handleSearch = (nextQuery: string) =>
    setSearchParams(nextQuery === '' ? {} : { q: nextQuery })
  const handleLoadMorePeople = () => people.fetchNextPage()
  const handleLoadMoreGroups = () => groups.fetchNextPage()

  return (
    <Page>
      <PageHeader title="~/search" />
      <SearchBar
        isPageAutofocus
        label="Search people and groups"
        defaultValue={query}
        onSearch={handleSearch}
      />
      {!isSearching && <EmptyState>type a name to find people and groups.</EmptyState>}
      {isSearching && (
        <>
          <Stack as="section" gap="medium">
            <Heading level={2}>people</Heading>
            <QueryStatus isLoading={people.isLoading} error={people.error} />
            {users && (
              <List
                items={users}
                renderItem={renderUser}
                emptyText={`nobody matches "${query}".`}
                loadMore={{
                  hasMore: people.hasNextPage,
                  isLoading: people.isFetchingNextPage,
                  onLoadMore: handleLoadMorePeople,
                }}
              />
            )}
          </Stack>
          <Stack as="section" gap="medium">
            <Heading level={2}>groups</Heading>
            <QueryStatus isLoading={groups.isLoading} error={groups.error} />
            {groupItems && (
              <List
                items={groupItems}
                loadMore={{
                  hasMore: groups.hasNextPage,
                  isLoading: groups.isFetchingNextPage,
                  onLoadMore: handleLoadMoreGroups,
                }}
                renderItem={renderGroup}
                columns={3}
                emptyText={`no group matches "${query}".`}
              />
            )}
          </Stack>
        </>
      )}
    </Page>
  )
}
