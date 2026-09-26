import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './Icon'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'heart', size: 24 },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Heart: Story = {}
export const HeartFilled: Story = { args: { name: 'heart-filled' } }
export const Comment: Story = { args: { name: 'comment' } }
export const Image: Story = { args: { name: 'image' } }
