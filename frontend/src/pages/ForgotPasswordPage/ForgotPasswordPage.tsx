import { Link } from 'react-router'
import { Heading, Stack, Text } from '~/components'
import { ForgotPasswordForm } from '~/features'
import { paths } from '~/paths'

export const ForgotPasswordPage = () => (
  <Stack gap="large">
    <Heading level={1}>$ reset</Heading>
    <Text size="small" tone="muted">
      we&apos;ll email you a link to set a new password.
    </Text>
    <ForgotPasswordForm />
    <Text size="small">
      <Link to={paths.login}>← back to log in</Link>
    </Text>
  </Stack>
)
