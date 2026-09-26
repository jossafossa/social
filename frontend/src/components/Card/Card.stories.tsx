import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heading } from '../Heading'
import { Text } from '../Text'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <Heading level={2}>password</Heading>
        <Text>Cards carry a hard offset shadow.</Text>
      </>
    ),
  },
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Accent: Story = { args: { variant: 'accent' } }
export const Danger: Story = { args: { variant: 'danger' } }
