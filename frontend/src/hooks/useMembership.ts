import { skipToken } from '@reduxjs/toolkit/query'
import { useGetMembershipsQuery } from '~/api'
import { useCurrentUser } from './useCurrentUser'

// A visitor is never a member.
export const useMembership = (groupId: string) => {
  const user = useCurrentUser()
  return useGetMembershipsQuery(user?.id ?? skipToken, {
    selectFromResult: ({ data, isLoading }) => ({
      membership: data?.find(({ group }) => group === groupId),
      isLoading,
    }),
  })
}
