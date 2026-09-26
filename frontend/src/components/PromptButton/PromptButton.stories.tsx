import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { PromptButton } from './PromptButton'

const meta = {
  title: 'Components/PromptButton',
  component: PromptButton,
  tags: ['autodocs'],
  args: { prompt: 'write a new post…', actionLabel: 'POST', onClick: fn() },
} satisfies Meta<typeof PromptButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const InGroup: Story = { args: { prompt: 'post in #cats…' } }
export const WithShortcut: Story = { args: { shortcutKey: 'n' } }
