import { useCurrentUser } from './useCurrentUser'

export const useAuthenticatedUser = () => {
  const user = useCurrentUser()
  if (!user) {
    throw new Error('useAuthenticatedUser is for members only: behind MembersOnly or a user check')
  }
  return user
}
