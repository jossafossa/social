import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { cats, photographers } from '../fixtures'
import { GroupCard } from './GroupCard'

const meta = {
  title: 'Components/GroupCard',
  component: GroupCard,
  tags: ['autodocs'],
  args: { group: cats, status: 'member', actions: <Button size="small">leave</Button> },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GroupCard>

export default meta

type Story = StoryObj<typeof meta>

export const Member: Story = {}
export const NotJoined: Story = {
  args: {
    group: photographers,
    status: 'not joined',
    actions: (
      <Button variant="accent" size="small">
        join
      </Button>
    ),
  },
}
