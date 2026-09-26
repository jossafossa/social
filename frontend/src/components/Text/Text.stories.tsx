import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './Text'

const meta = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: { children: 'friends + your groups' },
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Body: Story = {}
export const Large: Story = { args: { size: 'large', children: 'I love cats' } }
export const SmallMuted: Story = { args: { size: 'small', tone: 'muted' } }
