import { useParams } from 'react-router'
import { useGetUserQuery } from '~/api'
import { Heading, Page, ProfileCard, QueryStatus, Stack } from '~/components'
import { FriendButton, PostFeed } from '~/features'

export const UserPage = () => {
  const { userId } = useParams()
  if (userId === undefined) {
    throw new Error('UserPage must be rendered on a route with a :userId param')
  }

  const { data: user, isLoading, error } = useGetUserQuery(userId)

  if (!user) {
    return <QueryStatus isLoading={isLoading} error={error} />
  }

  return (
    <Page>
      <ProfileCard user={user} actions={<FriendButton friendId={user.id} />} />
      <Stack as="section" gap="medium">
        <Heading level={2} title={`posts by ${user.name}`}>
          posts by {user.name}
        </Heading>
        <PostFeed filter={{ kind: 'author', authorId: user.id }} />
      </Stack>
    </Page>
  )
}
