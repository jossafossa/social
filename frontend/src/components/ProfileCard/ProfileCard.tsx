import type { ReactNode } from 'react'
import { getFileUrl, type UserProfile } from '~/api'
import { Avatar } from '../Avatar'
import { Clamp } from '../Clamp'
import { Heading } from '../Heading'
import { Markdown } from '../Markdown'
import { Stack } from '../Stack'
import { Text } from '../Text'
import styles from './ProfileCard.module.scss'

type ProfileCardProps = {
  user: UserProfile
  actions?: ReactNode
}

export const ProfileCard = ({ user, actions }: ProfileCardProps) => (
  <section className={styles.card}>
    <Avatar name={user.name} size="xlarge" src={getFileUrl(user, user.avatar, '192x192')} />
    <Stack gap="medium">
      <Heading level={1} title={user.name}>
        {user.name}
      </Heading>
      {user.bio === '' ? (
        <Text tone="muted">
          <em>no bio yet</em>
        </Text>
      ) : (
        <Clamp>
          <Markdown tone="muted">{user.bio}</Markdown>
        </Clamp>
      )}
      {actions && <Stack direction="row">{actions}</Stack>}
    </Stack>
  </section>
)
