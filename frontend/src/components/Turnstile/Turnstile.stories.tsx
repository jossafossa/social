import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Turnstile } from './Turnstile'

// Cloudflare's test keys: the first always passes, the second always fails.
const meta = {
  title: 'Components/Turnstile',
  component: Turnstile,
  tags: ['autodocs'],
  args: { siteKey: '1x00000000000000000000AA', onChange: fn() },
} satisfies Meta<typeof Turnstile>

export default meta

type Story = StoryObj<typeof meta>

export const Passing: Story = {}
export const Failing: Story = { args: { siteKey: '2x00000000000000000000AB' } }
export const WithError: Story = { args: { error: "confirm you're human" } }
