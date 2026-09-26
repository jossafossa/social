import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { SearchOverlay } from './SearchOverlay'

const meta = {
  title: 'Components/SearchOverlay',
  component: SearchOverlay,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { isOpen: true, onClose: fn(), onSearch: fn() },
} satisfies Meta<typeof SearchOverlay>

export default meta

type Story = StoryObj<typeof meta>

export const Open: Story = {}
