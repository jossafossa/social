import type { Meta, StoryObj } from '@storybook/react-vite'
import { QueryStatus } from './QueryStatus'

const meta = {
  title: 'Components/QueryStatus',
  component: QueryStatus,
  tags: ['autodocs'],
  args: { isLoading: true },
} satisfies Meta<typeof QueryStatus>

export default meta

type Story = StoryObj<typeof meta>

export const Loading: Story = {}
export const Failed: Story = { args: { isLoading: false, error: 'Something went wrong' } }
