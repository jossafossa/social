import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Toast } from '../Toast'
import { ToastRegion } from './ToastRegion'

const meta = {
  title: 'Components/ToastRegion',
  component: ToastRegion,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    children: (
      <>
        <Toast
          message="Failed to authenticate."
          variant="error"
          onDismiss={fn()}
          durationMs={600000}
        />
        <Toast message="password changed" variant="status" onDismiss={fn()} durationMs={600000} />
      </>
    ),
  },
} satisfies Meta<typeof ToastRegion>

export default meta

type Story = StoryObj<typeof meta>

export const Stacked: Story = {}
