import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonLink } from './ButtonLink'

const meta = {
  title: 'Components/ButtonLink',
  component: ButtonLink,
  tags: ['autodocs'],
  args: { to: '/groups/new', children: '+ NEW GROUP', variant: 'primary' },
} satisfies Meta<typeof ButtonLink>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary', children: 'cancel' } }
