import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { getFileUrl, type Group } from '~/api'
import { paths } from '~/paths'
import { pickSwatch } from '~/utils'
import { Avatar } from '../Avatar'
import { Stack } from '../Stack'
import { Text } from '../Text'
import styles from './GroupCard.module.scss'

type GroupCardProps = {
  group: Group
  status?: string
  actions?: ReactNode
}

export const GroupCard = ({ group, status, actions }: GroupCardProps) => (
  <article className={styles.card}>
    <Link
      to={paths.group(group.id)}
      className={styles.band}
      style={{ background: pickSwatch(group.name) }}
    >
      <span className={styles.avatar}>
        <Avatar name={group.name} size="medium" src={getFileUrl(group, group.image, '192x192')} />
      </span>
      <span title={`#${group.name.toLowerCase()}`} className={styles.name}>
        #{group.name.toLowerCase()}
      </span>
    </Link>
    <Stack direction="row" justify="between" className={styles.footer}>
      <Text as="span" size="small" tone="muted">
        {status}
      </Text>
      {actions}
    </Stack>
  </article>
)
