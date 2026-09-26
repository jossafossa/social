import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumbs } from './Breadcrumbs'

const groupsCrumb = { id: 'groups', label: 'groups', to: '/groups' }

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: { items: [groupsCrumb, { id: 'cats', label: '#cats' }] },
} satisfies Meta<typeof Breadcrumbs>

export default meta

type Story = StoryObj<typeof meta>

export const Group: Story = {}
export const NewGroup: Story = { args: { items: [groupsCrumb, { id: 'new', label: 'new' }] } }
export const Home: Story = { args: { items: [] } }
