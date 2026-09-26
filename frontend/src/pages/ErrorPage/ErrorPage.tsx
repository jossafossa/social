import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Button, ButtonLink, ErrorScreen, Stack, Text } from '~/components'
import { paths } from '~/paths'
import { getErrorMessage } from '~/utils'

const describe = (error: unknown) =>
  isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : getErrorMessage(error)

// The router's error boundary: anything a route throws while rendering lands here.
export const ErrorPage = () => {
  const error = useRouteError()

  const handleReload = () => window.location.reload()

  return (
    <ErrorScreen title="$ something broke">
      <Text tone="muted">{describe(error)}</Text>
      <Stack direction="row">
        <Button variant="primary" onClick={handleReload}>
          reload
        </Button>
        <ButtonLink to={paths.home}>go home</ButtonLink>
      </Stack>
    </ErrorScreen>
  )
}
