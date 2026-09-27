import { useSearchParams } from 'react-router'
import { useGetGroupsInfiniteQuery, type Group } from '~/api'
import { ButtonLink, List, Page, PageHeader, QueryStatus, SearchBar } from '~/components'
import { GroupItem } from '~/features'
import { useCurrentUser } from '~/hooks'
import { paths } from '~/paths'
import { flattenPages } from '~/utils'

const renderGroup = (group: Group) => <GroupItem group={group} />

export const GroupsPage = () => {
  const user = useCurrentUser()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetGroupsInfiniteQuery(query)
  const groups = flattenPages(data)

  const handleSearch = (nextQuery: string) =>
    setSearchParams(nextQuery === '' ? {} : { q: nextQuery })
  const handleLoadMore = () => fetchNextPage()

  return (
    <Page>
      <PageHeader title="~/groups">
        {user && (
          <ButtonLink
            to={paths.newGroup}
            variant="primary"
            shortcut={['n']}
            data-shortcut="n"
            aria-keyshortcuts="n"
          >
            + NEW GROUP
          </ButtonLink>
        )}
      </PageHeader>
      <SearchBar label="Search groups" defaultValue={query} onSearch={handleSearch} />
      <QueryStatus isLoading={isLoading} error={error} />
      {groups && (
        <List
          items={groups}
          loadMore={{
            hasMore: hasNextPage,
            isLoading: isFetchingNextPage,
            onLoadMore: handleLoadMore,
            isAutomatic: true,
          }}
          renderItem={renderGroup}
          columns={3}
          emptyText={
            query === ''
              ? 'no groups yet. create the first one.'
              : `no group matches "${query}". try part of a name.`
          }
        />
      )}
    </Page>
  )
}
