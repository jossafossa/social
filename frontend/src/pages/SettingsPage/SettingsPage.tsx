import { Link } from 'react-router'
import { Card, Grid, Heading, Page, PageHeader, Stack, Text } from '~/components'
import { DeleteAccountButton, PasswordForm, ProfileForm } from '~/features'
import { useAuthenticatedUser } from '~/hooks'
import { paths } from '~/paths'

export const SettingsPage = () => {
  const user = useAuthenticatedUser()

  return (
    <Page>
      <PageHeader title="~/settings">
        <Text size="small">
          <Link to={paths.user(user.id)}>view my public page →</Link>
        </Text>
      </PageHeader>
      <Grid columns={2}>
        <Card as="section">
          <Heading level={2}>profile</Heading>
          <ProfileForm />
        </Card>
        <Stack gap="large">
          <Card as="section">
            <Heading level={2}>password</Heading>
            <PasswordForm />
          </Card>
          <Card as="section" variant="danger">
            <Heading level={2}>danger zone</Heading>
            <Text size="small">
              deletes your account, posts, likes, comments and memberships. no undo.
            </Text>
            <DeleteAccountButton />
          </Card>
        </Stack>
      </Grid>
    </Page>
  )
}
