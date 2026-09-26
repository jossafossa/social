import { ButtonLink, EmptyState, Page, PageHeader, Stack } from '~/components'
import { paths } from '~/paths'

export const NotFoundPage = () => (
  <Page>
    <PageHeader title="~/404" />
    <EmptyState>
      nothing lives at this address. it may have been deleted, or the link is wrong.
    </EmptyState>
    <Stack direction="row">
      <ButtonLink to={paths.home} variant="primary">
        ← back home
      </ButtonLink>
    </Stack>
  </Page>
)
