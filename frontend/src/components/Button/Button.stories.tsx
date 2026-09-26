import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'follow', onClick: fn() },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Secondary: Story = {}
export const Primary: Story = { args: { variant: 'primary', children: 'POST' } }
export const Accent: Story = { args: { variant: 'accent', children: '+ add friend' } }
export const Danger: Story = { args: { variant: 'danger', children: 'DELETE ACCOUNT' } }
export const Dashed: Story = { args: { variant: 'dashed', children: 'load more ↓' } }
export const Plain: Story = { args: { variant: 'plain', children: 'cancel' } }
export const Small: Story = { args: { size: 'small', children: 'leave' } }
export const Disabled: Story = { args: { variant: 'accent', disabled: true } }
export const WithShortcut: Story = {
  args: { variant: 'primary', children: 'POST', shortcut: ['⌘', '↵'] },
}
export const Busy: Story = { args: { variant: 'accent', isBusy: true } }
