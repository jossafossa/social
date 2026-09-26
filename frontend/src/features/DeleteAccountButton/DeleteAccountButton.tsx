import { useDeleteAccountMutation } from '~/api'
import { Button, Stack } from '~/components'
import { useAuthenticatedUser, useLogout } from '~/hooks'

export const DeleteAccountButton = () => {
  const user = useAuthenticatedUser()
  const logout = useLogout()
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation()

  const handleClick = async () => {
    if (!window.confirm('Delete your account, posts, likes and comments? This cannot be undone.')) {
      return
    }
    const result = await deleteAccount(user.id)
    if (!result.error) {
      logout()
    }
  }

  return (
    <Stack direction="row">
      <Button variant="danger" onClick={handleClick} isBusy={isLoading}>
        DELETE ACCOUNT
      </Button>
    </Stack>
  )
}
