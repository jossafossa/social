import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'DoeMaarDave', size: 'medium' },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Small: Story = { args: { size: 'small' } }
export const Medium: Story = {}
export const Large: Story = { args: { size: 'large', name: 'bob' } }
export const ExtraLarge: Story = { args: { size: 'xlarge', name: 'carol' } }
