import { useNavigate } from 'react-router'
import type { Group } from '~/api'
import { Card, Page, PageHeader, Text } from '~/components'
import { CreateGroupForm } from '~/features'
import { paths } from '~/paths'

export const CreateGroupPage = () => {
  const navigate = useNavigate()

  const handleCreated = ({ id }: Group) => navigate(paths.group(id))

  return (
    <Page>
      <PageHeader title="~/groups/new" />
      <Card>
        <CreateGroupForm onCreated={handleCreated} />
      </Card>
      <Text size="small" tone="muted">
        you join the group automatically. anyone can join or leave.
      </Text>
    </Page>
  )
}
