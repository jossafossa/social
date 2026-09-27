import { useEffect } from 'react'
import { restoreSession, useRequestVerificationMutation } from '~/api'
import { Button, Message, Stack } from '~/components'
import { useCurrentUser } from '~/hooks'

// Writing waits for a confirmed email. The link opens the confirm page in another tab, so coming
// back here reloads the account: posting unlocks without a page reload.
export const VerifyEmailNotice = () => {
  const user = useCurrentUser()
  const [requestVerification, { isLoading, isSuccess }] = useRequestVerificationMutation()
  const isUnverified = user !== undefined && !user.verified

  useEffect(() => {
    if (!isUnverified) {
      return
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void restoreSession()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isUnverified])

  if (!isUnverified) {
    return null
  }

  const handleResend = () => requestVerification()

  return (
    <Stack gap="small">
      <Message variant="notice">
        confirm your email to post, comment and like: the link went to {user.email}.
      </Message>
      <Stack direction="row">
        <Button size="small" onClick={handleResend} isBusy={isLoading}>
          {isSuccess ? 'sent again' : 'send it again'}
        </Button>
      </Stack>
    </Stack>
  )
}
