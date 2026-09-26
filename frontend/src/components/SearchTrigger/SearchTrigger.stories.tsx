import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SearchTrigger } from './SearchTrigger'

const meta = {
  title: 'Components/SearchTrigger',
  component: SearchTrigger,
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof SearchTrigger>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
