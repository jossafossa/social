import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from '../Avatar'
import { FileField } from './FileField'

const meta = {
  title: 'Components/FileField',
  component: FileField,
  tags: ['autodocs'],
  args: { label: 'choose an image', hint: 'jpg, png or webp · shrunk to 512px', accept: 'image/*' },
} satisfies Meta<typeof FileField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithPreview: Story = {
  args: { label: 'change picture', preview: <Avatar name="DoeMaarDave" size="large" /> },
}
export const WithError: Story = { args: { error: 'choose an image file' } }
