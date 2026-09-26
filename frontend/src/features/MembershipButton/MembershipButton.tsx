import { useJoinGroupMutation, useLeaveGroupMutation } from '~/api'
import { Button } from '~/components'
import { useCurrentUser, useGuestFollows, useMembership } from '~/hooks'

type MembershipButtonProps = {
  groupId: string
}

// A visitor follows instead of joining: kept in their browser, and it can't post.
const GuestFollowButton = ({ groupId }: MembershipButtonProps) => {
  const { groupIds, toggleGroup } = useGuestFollows()
  const isFollowing = groupIds.includes(groupId)

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'accent'}
      size="small"
      aria-pressed={isFollowing}
      onClick={() => toggleGroup(groupId)}
    >
      {isFollowing ? 'unfollow' : 'follow'}
    </Button>
  )
}

const MemberButton = ({ groupId, userId }: MembershipButtonProps & { userId: string }) => {
  const { membership, isLoading } = useMembership(groupId)
  const [joinGroup, { isLoading: isJoining }] = useJoinGroupMutation()
  const [leaveGroup, { isLoading: isLeaving }] = useLeaveGroupMutation()

  const handleClick = () =>
    membership ? leaveGroup(membership.id) : joinGroup({ userId, groupId })

  return (
    <Button
      variant={membership ? 'secondary' : 'accent'}
      size="small"
      onClick={handleClick}
      isBusy={isLoading || isJoining || isLeaving}
    >
      {membership ? 'leave' : 'join'}
    </Button>
  )
}

export const MembershipButton = ({ groupId }: MembershipButtonProps) => {
  const user = useCurrentUser()
  return user ? (
    <MemberButton groupId={groupId} userId={user.id} />
  ) : (
    <GuestFollowButton groupId={groupId} />
  )
}
