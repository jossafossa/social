import type { PostsFilter } from '~/api'
import { Disclosure, Page, PageHeader, PromptButton, Text } from '~/components'
import { HomeAside, PostFeed, PostForm, VerifyEmailNotice } from '~/features'
import { useCurrentUser, useGuestFollows } from '~/hooks'

export const HomePage = () => {
  const user = useCurrentUser()
  const { userIds, groupIds } = useGuestFollows()
  const isFollowingAnything = userIds.length > 0 || groupIds.length > 0

  // A visitor who follows nobody yet sees every post, to find people and groups to follow.
  let filter: PostsFilter = { kind: 'everyone' }
  if (user) {
    filter = { kind: 'home', userId: user.id }
  } else if (isFollowingAnything) {
    filter = { kind: 'following', userIds, groupIds }
  }

  let subtitle = 'everyone · follow people and groups to make this yours'
  if (user) {
    subtitle = 'friends + your groups'
  } else if (isFollowingAnything) {
    subtitle = 'people + groups you follow'
  }

  return (
    <Page aside={<HomeAside />}>
      <PageHeader title="~/home">
        <Text size="small" tone="muted">
          {subtitle}
        </Text>
      </PageHeader>
      <VerifyEmailNotice />
      {user && (
        <Disclosure
          label="new post"
          title="new post"
          renderTrigger={(handleOpen) => (
            <PromptButton
              prompt="write a new post…"
              actionLabel="POST"
              shortcutKey="n"
              onClick={handleOpen}
            />
          )}
        >
          {(handleClose) => <PostForm onSuccess={handleClose} onCancel={handleClose} />}
        </Disclosure>
      )}
      <PostFeed filter={filter} />
    </Page>
  )
}
