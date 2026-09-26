import type { Meta, StoryObj } from '@storybook/react-vite'
import { groupPost } from '../fixtures'
import { LinkList } from '../LinkList'
import { PageHeader } from '../PageHeader'
import { PostCard } from '../PostCard'
import { Page } from './Page'

const meta = {
  title: 'Components/Page',
  component: Page,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <PageHeader title="~/home" />
        <PostCard post={groupPost} />
      </>
    ),
  },
} satisfies Meta<typeof Page>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithAside: Story = {
  args: {
    aside: (
      <LinkList
        title="your groups"
        items={[{ id: 'cats', label: '#cats', to: '/groups/cats' }]}
        emptyText="no groups yet"
      />
    ),
  },
}
