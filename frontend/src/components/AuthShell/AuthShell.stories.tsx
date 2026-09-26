import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../Button'
import { Form } from '../Form'
import { Heading } from '../Heading'
import { Message } from '../Message'
import { Stack } from '../Stack'
import { TextField } from '../TextField'
import { AuthShell } from './AuthShell'

const meta = {
  title: 'Components/AuthShell',
  component: AuthShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    children: (
      <Stack gap="medium">
        <Heading level={1}>$ login</Heading>
        <Form>
          <TextField label="email" type="email" />
          <TextField label="password" type="password" />
          <Message variant="error">failed to authenticate.</Message>
          <Button type="submit" variant="accent">
            LOG IN →
          </Button>
        </Form>
      </Stack>
    ),
  },
} satisfies Meta<typeof AuthShell>

export default meta

type Story = StoryObj<typeof meta>

export const Login: Story = {}
