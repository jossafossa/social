import { Link } from 'react-router'
import { Heading, Stack, Text } from '~/components'
import { LoginForm } from '~/features'
import { paths } from '~/paths'

export const LoginPage = () => (
  <Stack gap="large">
    <Heading level={1}>$ login</Heading>
    <LoginForm />
    <Stack direction="row" justify="between">
      <Text size="small">
        <Link to={paths.register}>create account</Link>
      </Text>
      <Text size="small">
        <Link to={paths.forgotPassword}>forgot password?</Link>
      </Text>
    </Stack>
  </Stack>
)
