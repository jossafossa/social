import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ShortcutHelp } from './ShortcutHelp'

const meta = {
  title: 'Components/ShortcutHelp',
  component: ShortcutHelp,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: fn(),
    shortcuts: [
      { keys: ['[', ']'], description: 'switch section' },
      { keys: ['/'], description: 'focus search' },
      { keys: ['⌘', '↵'], description: 'submit the form' },
    ],
  },
} satisfies Meta<typeof ShortcutHelp>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {}
