import classNames from 'classnames'
import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import type { Comment } from '~/api'
import { paths } from '~/paths'
import truncateStyles from '~/styles/truncate.module.scss'
import { formatRelativeTime } from '~/utils'
import { Clamp } from '../Clamp'
import { LoadMoreButton } from '../LoadMoreButton'
import { Markdown } from '../Markdown'
import { Stack } from '../Stack'
import { Text } from '../Text'
import { useLoadMoreFocus } from '../useLoadMoreFocus'
import styles from './CommentList.module.scss'

type CommentListProps = {
  comments: Comment[]
  loadMore?: { hasMore: boolean; isLoading: boolean; onLoadMore: () => void; label?: string }
  // The reply control, shown at the end of the thread.
  children?: ReactNode
}

export const CommentList = ({ comments, loadMore, children }: CommentListProps) => {
  const listRef = useRef<HTMLUListElement>(null)
  const markLoadMore = useLoadMoreFocus(listRef, comments.length, loadMore?.isLoading ?? false)

  const handleLoadMore = () => {
    markLoadMore()
    loadMore?.onLoadMore()
  }

  return (
    <Stack gap="medium" className={styles.thread}>
      {comments.length === 0 ? (
        <Text size="small" tone="muted">
          no comments yet
        </Text>
      ) : (
        <ul ref={listRef} className={styles.list}>
          {comments.map(({ id, author, content, created, expand }) => {
            const authorName = expand?.author?.name ?? 'unknown'
            return (
              // Focusable only by script, so load more can hand focus to the first new comment.
              <li key={id} tabIndex={-1}>
                <Stack gap="none">
                  <Stack direction="row" gap="small" className={styles.meta}>
                    <Link
                      to={paths.user(author)}
                      title={authorName}
                      className={classNames(styles.author, truncateStyles.truncate)}
                    >
                      {authorName}
                    </Link>
                    <Text as="span" size="small" tone="muted">
                      · <time dateTime={created}>{formatRelativeTime(created)}</time>
                    </Text>
                  </Stack>
                  <Clamp>
                    <Markdown size="small">{content}</Markdown>
                  </Clamp>
                </Stack>
              </li>
            )
          })}
        </ul>
      )}
      {loadMore && (
        <LoadMoreButton
          hasMore={loadMore.hasMore}
          isLoading={loadMore.isLoading}
          onLoadMore={handleLoadMore}
          label={loadMore.label}
        />
      )}
      {children}
    </Stack>
  )
}
