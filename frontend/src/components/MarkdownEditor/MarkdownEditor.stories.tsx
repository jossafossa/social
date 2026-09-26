import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { MarkdownEditor } from './MarkdownEditor'

const meta = {
  title: 'Components/MarkdownEditor',
  component: MarkdownEditor,
  tags: ['autodocs'],
  args: { label: "what's happening?", value: '', onChange: fn(), maxLength: 1000 },
} satisfies Meta<typeof MarkdownEditor>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithContent: Story = {
  args: { value: 'Some **bold** and ++underlined++ text.\n\n- a list\n- of things' },
}
export const Compact: Story = {
  args: { label: 'reply', isLabelHidden: true, placeholder: 'write a reply…', size: 'compact' },
}
export const WithError: Story = { args: { error: 'write something first' } }
