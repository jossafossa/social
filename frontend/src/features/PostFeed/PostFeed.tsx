import { useGetPostsInfiniteQuery, type FeedPost, type PostsFilter } from '~/api'
import { FeedControls, List, QueryStatus, Stack } from '~/components'
import { useFeedOptions } from '~/hooks'
import { flattenPages } from '~/utils'
import { PostItem } from '../PostItem'

type PostFeedProps = {
  filter: PostsFilter
}

const renderPost = (post: FeedPost) => <PostItem post={post} />

export const PostFeed = ({ filter }: PostFeedProps) => {
  const { sort, period, setSort, setPeriod } = useFeedOptions()
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetPostsInfiniteQuery({ filter, sort, period })
  const posts = flattenPages(data)

  const handleLoadMore = () => fetchNextPage()

  return (
    <Stack gap="medium">
      <FeedControls sort={sort} period={period} onSortChange={setSort} onPeriodChange={setPeriod} />
      <QueryStatus isLoading={isLoading} error={error} />
      {posts && (
        <List
          items={posts}
          renderItem={renderPost}
          emptyText={period === 'all' ? 'No posts yet' : `No posts in the last ${period}`}
          loadMore={{
            hasMore: hasNextPage,
            isLoading: isFetchingNextPage,
            onLoadMore: handleLoadMore,
            isAutomatic: true,
          }}
        />
      )}
    </Stack>
  )
}
