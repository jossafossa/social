import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Stack } from './Stack'

const meta = {
  title: 'Components/Stack',
  component: Stack,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Button>one</Button>
        <Button>two</Button>
        <Button>three</Button>
      </>
    ),
  },
} satisfies Meta<typeof Stack>

export default meta

type Story = StoryObj<typeof meta>

export const Column: Story = {}
export const Row: Story = { args: { direction: 'row', gap: 'medium' } }
export const ColumnAlignedStart: Story = { args: { align: 'start' } }
