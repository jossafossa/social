import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { CommentList } from '../CommentList'
import { comments, groupPost, personalPost } from '../fixtures'
import { Icon } from '../Icon'
import { Stack } from '../Stack'
import { TextArea } from '../TextArea'
import { PostCard } from './PostCard'

const meta = {
  title: 'Components/PostCard',
  component: PostCard,
  tags: ['autodocs'],
  args: {
    post: groupPost,
    children: (
      <Stack direction="row">
        <Button variant="accent" size="small" aria-pressed="true">
          <Icon name="heart-filled" size={14} />1 like
        </Button>
        <Button size="small">0 comments</Button>
      </Stack>
    ),
  },
} satisfies Meta<typeof PostCard>

export default meta

type Story = StoryObj<typeof meta>

export const InGroup: Story = {}
export const WithComments: Story = {
  args: {
    post: personalPost,
    children: (
      <>
        <Stack direction="row">
          <Button size="small">
            <Icon name="heart" size={14} />
            like
          </Button>
          <Button variant="primary" size="small">
            hide comments
          </Button>
        </Stack>
        <CommentList comments={comments} />
      </>
    ),
  },
}
export const Editing: Story = {
  args: {
    badge: 'editing',
    body: <TextArea label="edit post" rows={2} defaultValue={groupPost.content} />,
    children: (
      <Stack direction="row">
        <Button variant="primary" size="small">
          SAVE
        </Button>
        <Button size="small">cancel</Button>
      </Stack>
    ),
  },
}
