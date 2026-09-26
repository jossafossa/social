import type { Meta, StoryObj } from '@storybook/react-vite'
import { Message } from './Message'

const meta = {
  title: 'Components/Message',
  component: Message,
  tags: ['autodocs'],
  args: { variant: 'error', children: 'failed to authenticate.' },
} satisfies Meta<typeof Message>

export default meta

type Story = StoryObj<typeof meta>

export const Error: Story = {}
export const Status: Story = { args: { variant: 'status', children: 'saved' } }
