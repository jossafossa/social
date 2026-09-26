import type { Meta, StoryObj } from '@storybook/react-vite'
import { cats, dogs, photographers } from '../fixtures'
import { Text } from '../Text'
import { List } from './List'

const meta = {
  title: 'Components/List',
  component: List,
  tags: ['autodocs'],
  args: {
    items: [cats, dogs, photographers],
    renderItem: ({ name }: { name: string }) => <Text>#{name.toLowerCase()}</Text>,
    emptyText: 'no groups yet',
  },
} satisfies Meta<typeof List<typeof cats>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { items: [] } }
