import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd } from './Kbd'

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { keys: ['?'] },
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Single: Story = {}
export const MacSubmit: Story = { args: { keys: ['⌘', '↵'] } }
export const WindowsSubmit: Story = { args: { keys: ['Ctrl', 'Enter'] } }
export const Inline: Story = { args: { keys: ['⌘', '↵'], variant: 'inline' } }
