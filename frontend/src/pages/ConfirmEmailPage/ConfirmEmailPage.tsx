import { Link, useParams } from 'react-router'
import { useConfirmEmailQuery } from '~/api'
import { Heading, LoadingState, Message, Stack, Text } from '~/components'
import { useCurrentUser } from '~/hooks'
import { paths } from '~/paths'

export const ConfirmEmailPage = () => {
  const { token = '' } = useParams()
  const user = useCurrentUser()
  const { isLoading, isSuccess, error } = useConfirmEmailQuery(token)

  return (
    <Stack gap="large">
      <Heading level={1}>$ confirm email</Heading>
      {isLoading && <LoadingState />}
      {/* PocketBase names the broken token claim; what matters is that the link is spent. */}
      {error !== undefined && (
        <Message variant="error">
          this link has expired or was replaced by a newer one: log in and send a new one from home.
        </Message>
      )}
      {isSuccess && <Message variant="status">email confirmed: you can post now.</Message>}
      <Text size="small">
        {user ? <Link to={paths.home}>→ go home</Link> : <Link to={paths.login}>→ log in</Link>}
      </Text>
    </Stack>
  )
}
