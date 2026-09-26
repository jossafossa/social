import type { Meta, StoryObj } from '@storybook/react-vite'
import { LinkList } from './LinkList'

const meta = {
  title: 'Components/LinkList',
  component: LinkList,
  tags: ['autodocs'],
  args: {
    title: 'friends',
    emptyText: 'no friends yet',
    items: [
      { id: 'bob', label: 'bob', to: '/users/bob', avatar: { name: 'bob' } },
      { id: 'carol', label: 'carol', to: '/users/carol', avatar: { name: 'carol' } },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LinkList>

export default meta

type Story = StoryObj<typeof meta>

export const WithAvatars: Story = {}
export const Groups: Story = {
  args: {
    title: 'your groups',
    items: [
      { id: 'cats', label: '#cats', to: '/groups/cats' },
      { id: 'dogs', label: '#dogs', to: '/groups/dogs' },
    ],
  },
}
export const Empty: Story = { args: { items: [] } }
