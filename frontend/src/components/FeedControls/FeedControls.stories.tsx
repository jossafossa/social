import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FeedControls } from './FeedControls'

const meta = {
  title: 'Components/FeedControls',
  component: FeedControls,
  tags: ['autodocs'],
  args: { sort: 'new', period: 'all', onSortChange: fn(), onPeriodChange: fn() },
} satisfies Meta<typeof FeedControls>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const TopThisWeek: Story = { args: { sort: 'likes', period: 'week' } }
