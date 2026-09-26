import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '../Text'
import { PageHeader } from './PageHeader'

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  args: {
    title: '~/home',
    children: (
      <Text size="small" tone="muted">
        friends + your groups
      </Text>
    ),
  },
} satisfies Meta<typeof PageHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
