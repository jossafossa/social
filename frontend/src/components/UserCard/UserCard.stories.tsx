import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { alice, bob } from '../fixtures'
import { UserCard } from './UserCard'

const meta = {
  title: 'Components/UserCard',
  component: UserCard,
  tags: ['autodocs'],
  args: { user: alice, actions: <Button size="small">− remove friend</Button> },
} satisfies Meta<typeof UserCard>

export default meta

type Story = StoryObj<typeof meta>

export const Friend: Story = {}
export const NotAFriend: Story = {
  args: {
    user: bob,
    actions: (
      <Button variant="accent" size="small">
        + add friend
      </Button>
    ),
  },
}
