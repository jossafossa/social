import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card'
import { Text } from '../Text'
import { Grid } from './Grid'

const meta = {
  title: 'Components/Grid',
  component: Grid,
  tags: ['autodocs'],
  args: {
    columns: 3,
    children: ['one', 'two', 'three', 'four'].map((label) => (
      <Card key={label}>
        <Text>{label}</Text>
      </Card>
    )),
  },
} satisfies Meta<typeof Grid>

export default meta

type Story = StoryObj<typeof meta>

export const ThreeColumns: Story = {}
export const TwoColumns: Story = { args: { columns: 2 } }
