import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextField } from './TextField'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'email', type: 'email' },
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithHint: Story = {
  args: { label: 'password', type: 'password', hint: '8+ characters' },
}
export const WithError: Story = { args: { error: 'enter a valid email' } }
