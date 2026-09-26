import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Stack } from '../Stack'
import { Text } from '../Text'
import { ErrorScreen } from './ErrorScreen'

const meta = {
  title: 'Components/ErrorScreen',
  component: ErrorScreen,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    title: '$ something broke',
    children: (
      <>
        <Text tone="muted">Cannot read properties of undefined (reading &apos;name&apos;)</Text>
        <Stack direction="row">
          <Button variant="primary">reload</Button>
        </Stack>
      </>
    ),
  },
} satisfies Meta<typeof ErrorScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
