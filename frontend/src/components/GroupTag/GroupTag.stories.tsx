import type { Meta, StoryObj } from '@storybook/react-vite'
import { GroupTag } from './GroupTag'

const meta = {
  title: 'Components/GroupTag',
  component: GroupTag,
  tags: ['autodocs'],
  args: { name: 'Cats', to: '/groups/cats' },
} satisfies Meta<typeof GroupTag>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
