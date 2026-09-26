import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { cats } from '../fixtures'
import { GroupHeader } from './GroupHeader'

const meta = {
  title: 'Components/GroupHeader',
  component: GroupHeader,
  tags: ['autodocs'],
  args: {
    group: cats,
    actions: (
      <>
        <Button size="small">edit group</Button>
        <Button size="small">leave</Button>
      </>
    ),
  },
} satisfies Meta<typeof GroupHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
