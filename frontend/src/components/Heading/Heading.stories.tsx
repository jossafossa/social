import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from './Heading'

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs'],
  args: { level: 1, children: '~/home' },
} satisfies Meta<typeof Heading>

export default meta

type Story = StoryObj<typeof meta>

export const PageTitle: Story = {}
export const SectionLabel: Story = { args: { level: 2, children: 'your groups' } }
