import type { ReactNode } from 'react'
import { Heading } from '../Heading'
import { Stack } from '../Stack'

type PageHeaderProps = {
  title: string
  children?: ReactNode
}

export const PageHeader = ({ title, children }: PageHeaderProps) => (
  <Stack as="header" direction="row" justify="between" gap="medium">
    <Heading level={1}>{title}</Heading>
    {children}
  </Stack>
)
