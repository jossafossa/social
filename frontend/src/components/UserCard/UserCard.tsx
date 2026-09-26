import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { getFileUrl, type UserProfile } from '~/api'
import { paths } from '~/paths'
import truncateStyles from '~/styles/truncate.module.scss'
import { Avatar } from '../Avatar'
import { Clamp } from '../Clamp'
import { Markdown } from '../Markdown'
import { Stack } from '../Stack'
import { Text } from '../Text'
import styles from './UserCard.module.scss'

type UserCardProps = {
  user: UserProfile
  actions?: ReactNode
}

export const UserCard = ({ user, actions }: UserCardProps) => (
  <Stack direction="row" gap="medium" className={styles.row}>
    <Avatar name={user.name} size="medium" src={getFileUrl(user, user.avatar, '192x192')} />
    <Stack gap="none" className={styles.details}>
      <Link
        to={paths.user(user.id)}
        title={user.name}
        className={classNames(styles.name, truncateStyles.truncate)}
      >
        {user.name}
      </Link>
      {user.bio === '' ? (
        <Text size="small" tone="muted">
          <em>no bio yet</em>
        </Text>
      ) : (
        // A list row is a summary: a few lines, the full bio is on the profile.
        <Clamp lines={3}>
          <Markdown size="small" tone="muted">
            {user.bio}
          </Markdown>
        </Clamp>
      )}
    </Stack>
    {actions}
  </Stack>
)
