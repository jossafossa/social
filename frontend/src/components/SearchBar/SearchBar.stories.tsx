import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SearchBar } from './SearchBar'

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: { label: 'Search people', onSearch: fn() },
} satisfies Meta<typeof SearchBar>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {}
export const WithQuery: Story = { args: { defaultValue: 'car' } }
export const Compact: Story = { args: { variant: 'compact' } }
