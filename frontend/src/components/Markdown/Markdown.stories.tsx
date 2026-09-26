import type { Meta, StoryObj } from '@storybook/react-vite'
import { Markdown } from './Markdown'

const meta = {
  title: 'Components/Markdown',
  component: Markdown,
  tags: ['autodocs'],
  args: {
    children:
      'Some **bold**, *italic*, ++underlined++ and ~~struck~~ text, with `code`.\n\n' +
      '- one\n- two\n\n1. first\n2. second\n\n> a quote\n\nA line\nbreak kept as typed.',
  },
} satisfies Meta<typeof Markdown>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Small: Story = { args: { size: 'small', tone: 'muted' } }
export const Disallowed: Story = {
  args: { children: '# Not a heading\n\n![no images](https://example.com/x.png) <b>no html</b>' },
}
