import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { LoadMoreButton } from './LoadMoreButton'

const meta = {
  title: 'Components/LoadMoreButton',
  component: LoadMoreButton,
  tags: ['autodocs'],
  args: { hasMore: true, isLoading: false, onLoadMore: fn() },
} satisfies Meta<typeof LoadMoreButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Loading: Story = { args: { isLoading: true } }
