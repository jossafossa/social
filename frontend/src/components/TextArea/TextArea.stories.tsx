import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextArea } from './TextArea'

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: { label: 'bio', rows: 4, placeholder: 'say something about yourself' },
} satisfies Meta<typeof TextArea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithCounter: Story = {
  args: { label: "what's happening?", maxLength: 1000, defaultValue: 'hello world!' },
}
export const WithError: Story = { args: { error: 'write something first' } }
