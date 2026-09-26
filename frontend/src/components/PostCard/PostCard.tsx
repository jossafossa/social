import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { getFileUrl, type Post } from '~/api'
import { paths } from '~/paths'
import truncateStyles from '~/styles/truncate.module.scss'
import { formatDate } from '~/utils'
import { Avatar } from '../Avatar'
import { Card } from '../Card'
import { Clamp } from '../Clamp'
import { GroupTag } from '../GroupTag'
import { Kbd } from '../Kbd'
import { Markdown } from '../Markdown'
import { Stack } from '../Stack'
import { Text } from '../Text'
import styles from './PostCard.module.scss'

type PostCardProps = {
  post: Post
  body?: ReactNode
  badge?: string
  children?: ReactNode
}

export const PostCard = ({
  post: { author, content, created, expand },
  body = (
    <Clamp>
      <Markdown size="large">{content}</Markdown>
    </Clamp>
  ),
  badge,
  children,
}: PostCardProps) => {
  const authorName = expand?.author?.name ?? 'unknown'

  return (
    // tabIndex -1: j/k move focus from post to post; the article itself is not a Tab stop.
    <article data-post tabIndex={-1} className={styles.post}>
      <span
        data-post-hint
        aria-hidden="true"
        className={classNames(styles.stepHint, styles.previous)}
      >
        <Kbd keys={['k']} /> prev
      </span>
      <span data-post-hint aria-hidden="true" className={classNames(styles.stepHint, styles.next)}>
        <Kbd keys={['j']} /> next
      </span>
      <Card as="div">
        <Stack as="header" direction="row" gap="medium" className={styles.header}>
          <Avatar
            name={authorName}
            size="small"
            src={expand?.author && getFileUrl(expand.author, expand.author.avatar, '64x64')}
          />
          <Link
            to={paths.user(author)}
            title={authorName}
            className={classNames(styles.author, truncateStyles.truncate)}
          >
            {authorName}
          </Link>
          {expand?.group && (
            <>
              <Text as="span" size="small" tone="muted">
                in
              </Text>
              <GroupTag name={expand.group.name} to={paths.group(expand.group.id)} />
            </>
          )}
          {badge && <span className={styles.badge}>{badge}</span>}
          <time dateTime={created} className={styles.time}>
            {formatDate(created)}
          </time>
        </Stack>
        {body}
        {children}
      </Card>
    </article>
  )
}
