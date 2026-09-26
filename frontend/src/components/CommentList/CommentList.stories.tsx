import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../Button'
import { comments } from '../fixtures'
import { CommentList } from './CommentList'

const meta = {
  title: 'Components/CommentList',
  component: CommentList,
  tags: ['autodocs'],
  args: { comments },
} satisfies Meta<typeof CommentList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithMore: Story = {
  args: {
    loadMore: { hasMore: true, isLoading: false, onLoadMore: fn(), label: 'show 12 more comments' },
    children: (
      <Button variant="dashed" size="small">
        + reply
      </Button>
    ),
  },
}
export const Empty: Story = { args: { comments: [] } }
