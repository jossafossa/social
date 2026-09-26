import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Toast } from './Toast'

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    message: 'Failed to create record.',
    variant: 'error',
    onDismiss: fn(),
    durationMs: 600000,
  },
} satisfies Meta<typeof Toast>

export default meta

type Story = StoryObj<typeof meta>

export const Error: Story = {}
export const Status: Story = { args: { variant: 'status', message: 'saved' } }
