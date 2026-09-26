import type { Meta, StoryObj } from '@storybook/react-vite'
import { Markdown } from '../Markdown'
import { Clamp } from './Clamp'

const longText = Array.from(
  { length: 16 },
  (_, index) => `Line ${index + 1} of a long comment.`,
).join('\n')

const meta = {
  title: 'Components/Clamp',
  component: Clamp,
  tags: ['autodocs'],
  args: { children: <Markdown size="small">{longText}</Markdown> },
} satisfies Meta<typeof Clamp>

export default meta

type Story = StoryObj<typeof meta>

export const Long: Story = {}
export const ThreeLines: Story = { args: { lines: 3 } }
export const Short: Story = { args: { children: <Markdown size="small">Fits easily.</Markdown> } }
