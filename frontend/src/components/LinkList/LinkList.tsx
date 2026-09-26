import type { ReactNode } from 'react'
import { Link } from 'react-router'
import truncateStyles from '~/styles/truncate.module.scss'
import { Avatar } from '../Avatar'
import { Heading } from '../Heading'
import { Stack } from '../Stack'
import { Text } from '../Text'
import styles from './LinkList.module.scss'

type LinkListItem = {
  id: string
  label: string
  to: string
  avatar?: { name: string; src?: string }
}

type LinkListProps = {
  title: string
  items: LinkListItem[]
  emptyText: string
  children?: ReactNode
}

export const LinkList = ({ title, items, emptyText, children }: LinkListProps) => (
  <Stack as="section" gap="medium">
    <Heading level={2}>{title}</Heading>
    {items.length === 0 ? (
      <Text size="small" tone="muted">
        {emptyText}
      </Text>
    ) : (
      <Stack as="ul" gap="small" className={styles.list}>
        {items.map(({ id, label, to, avatar }) => (
          <li key={id}>
            <Link to={to} className={styles.link}>
              {avatar && <Avatar name={avatar.name} size="small" src={avatar.src} />}
              <span title={label} className={truncateStyles.truncate}>
                {label}
              </span>
            </Link>
          </li>
        ))}
      </Stack>
    )}
    {children}
  </Stack>
)
