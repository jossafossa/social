import type { Meta, StoryObj } from '@storybook/react-vite'
import { PromptButton } from '../PromptButton'
import { TextArea } from '../TextArea'
import { Disclosure } from './Disclosure'

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  args: {
    label: 'edit group',
    children: () => <TextArea label="post" rows={3} />,
  },
} satisfies Meta<typeof Disclosure>

export default meta

type Story = StoryObj<typeof meta>

export const Plain: Story = {}
export const TitledCard: Story = { args: { title: 'new post' } }
export const CustomTrigger: Story = {
  args: {
    title: 'new post',
    renderTrigger: (onOpen) => (
      <PromptButton prompt="write a new post…" actionLabel="POST" onClick={onOpen} />
    ),
  },
}
