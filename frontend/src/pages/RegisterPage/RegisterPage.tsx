import { Link } from 'react-router'
import { Heading, Stack, Text } from '~/components'
import { RegisterForm } from '~/features'
import { paths } from '~/paths'

export const RegisterPage = () => (
  <Stack gap="large">
    <Heading level={1}>$ signup</Heading>
    <RegisterForm />
    <Text size="small">
      already in? <Link to={paths.login}>log in</Link>
    </Text>
  </Stack>
)
