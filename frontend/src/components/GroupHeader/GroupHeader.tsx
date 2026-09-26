import type { ReactNode } from 'react'
import { getFileUrl, type Group } from '~/api'
import { pickSwatch } from '~/utils'
import { Avatar } from '../Avatar'
import { Heading } from '../Heading'
import { Stack } from '../Stack'
import styles from './GroupHeader.module.scss'

type GroupHeaderProps = {
  group: Group
  actions?: ReactNode
}

export const GroupHeader = ({ group, actions }: GroupHeaderProps) => (
  <header className={styles.header} style={{ background: pickSwatch(group.name) }}>
    <span className={styles.picture}>
      <Avatar name={group.name} size="large" src={getFileUrl(group, group.image, '192x192')} />
    </span>
    <Stack gap="small" className={styles.title}>
      <Heading level={2}>group</Heading>
      <Heading level={1} title={`#${group.name.toLowerCase()}`}>
        #{group.name.toLowerCase()}
      </Heading>
    </Stack>
    {actions && <Stack direction="row">{actions}</Stack>}
  </header>
)
