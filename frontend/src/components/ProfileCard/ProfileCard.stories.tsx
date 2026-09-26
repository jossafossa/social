import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { alice, bob } from '../fixtures'
import { ProfileCard } from './ProfileCard'

const meta = {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  tags: ['autodocs'],
  args: { user: alice, actions: <Button size="small">− remove friend</Button> },
} satisfies Meta<typeof ProfileCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithoutBio: Story = { args: { user: bob } }
