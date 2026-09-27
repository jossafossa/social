import { Link, useParams } from 'react-router'
import { Heading, Stack, Text } from '~/components'
import { ResetPasswordForm } from '~/features'
import { paths } from '~/paths'

export const ResetPasswordPage = () => {
  const { token = '' } = useParams()

  return (
    <Stack gap="large">
      <Heading level={1}>$ new password</Heading>
      <ResetPasswordForm token={token} />
      <Text size="small">
        <Link to={paths.login}>← back to log in</Link>
      </Text>
    </Stack>
  )
}
