import { useState } from 'react'
import { Link } from 'react-router'
import { useGetCommentsInfiniteQuery } from '~/api'
import { Button, CommentList, QueryStatus, Stack, Text } from '~/components'
import { useCurrentUser, useFocusReturn } from '~/hooks'
import { paths } from '~/paths'
import { flattenPages } from '~/utils'
import { CommentForm } from '../CommentForm'

type PostCommentsProps = {
  postId: string
  commentCount: number
}

// The post's counter can lag behind the thread (someone commented since), so it only sets the label.
const toLoadMoreLabel = (remaining: number) => {
  if (remaining <= 0) {
    return 'show more comments'
  }
  return remaining === 1 ? 'show 1 more comment' : `show ${remaining} more comments`
}

export const PostComments = ({ postId, commentCount }: PostCommentsProps) => {
  const user = useCurrentUser()
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetCommentsInfiniteQuery(postId)
  const [isReplying, setIsReplying] = useState(false)
  const replyButtonRef = useFocusReturn<HTMLButtonElement>(isReplying)
  const comments = flattenPages(data)

  const handleLoadMore = () => fetchNextPage()
  const handleReply = () => setIsReplying(true)
  const handleCloseReply = () => setIsReplying(false)

  return (
    <>
      <QueryStatus isLoading={isLoading} error={error} />
      {comments && (
        <CommentList
          comments={comments}
          loadMore={{
            hasMore: hasNextPage,
            isLoading: isFetchingNextPage,
            onLoadMore: handleLoadMore,
            label: toLoadMoreLabel(commentCount - comments.length),
          }}
        >
          {!user && (
            <Text size="small" tone="muted">
              <Link to={paths.login}>log in</Link> to reply
            </Text>
          )}
          {user && isReplying && (
            <CommentForm postId={postId} onSuccess={handleCloseReply} onCancel={handleCloseReply} />
          )}
          {user && !isReplying && (
            <Stack direction="row">
              <Button
                ref={replyButtonRef}
                variant="dashed"
                size="small"
                data-post-action="reply"
                shortcut={['r']}
                isPostShortcut
                aria-keyshortcuts="r"
                onClick={handleReply}
              >
                + reply
              </Button>
            </Stack>
          )}
        </CommentList>
      )}
    </>
  )
}
