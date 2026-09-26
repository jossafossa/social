import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { TextField } from '../TextField'
import { Form } from './Form'

const meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <TextField label="email" type="email" />
        <TextField label="password" type="password" />
        <Button type="submit" variant="accent">
          LOG IN →
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof Form>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
