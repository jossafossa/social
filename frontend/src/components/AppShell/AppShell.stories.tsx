import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Breadcrumbs } from '../Breadcrumbs'
import { groupPost, personalPost } from '../fixtures'
import { PageHeader } from '../PageHeader'
import { PostCard } from '../PostCard'
import { PromptButton } from '../PromptButton'
import { Sidebar } from '../Sidebar'
import { Stack } from '../Stack'
import { AppShell } from './AppShell'

const meta = {
  title: 'Components/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    sidebar: <Sidebar account={{ name: 'DoeMaarDave', onLogout: fn() }} />,
    topBar: <Breadcrumbs items={[]} />,
    children: (
      <Stack gap="large">
        <PageHeader title="~/home" />
        <PromptButton prompt="write a new post…" actionLabel="POST" onClick={fn()} />
        <PostCard post={groupPost} />
        <PostCard post={personalPost} />
      </Stack>
    ),
  },
} satisfies Meta<typeof AppShell>

export default meta

type Story = StoryObj<typeof meta>

export const Home: Story = {}
