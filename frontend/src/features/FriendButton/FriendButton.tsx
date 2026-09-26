import { useAddFriendMutation, useRemoveFriendMutation } from '~/api'
import { Button } from '~/components'
import { useCurrentUser, useGuestFollows } from '~/hooks'

type FriendButtonProps = {
  friendId: string
}

// A visitor follows instead: kept in their browser, no account needed.
const GuestFollowButton = ({ friendId }: FriendButtonProps) => {
  const { userIds, toggleUser } = useGuestFollows()
  const isFollowing = userIds.includes(friendId)

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'accent'}
      size="small"
      aria-pressed={isFollowing}
      onClick={() => toggleUser(friendId)}
    >
      {isFollowing ? '− unfollow' : '+ follow'}
    </Button>
  )
}

export const FriendButton = ({ friendId }: FriendButtonProps) => {
  const user = useCurrentUser()
  const [addFriend, { isLoading: isAdding }] = useAddFriendMutation()
  const [removeFriend, { isLoading: isRemoving }] = useRemoveFriendMutation()

  if (!user) {
    return <GuestFollowButton friendId={friendId} />
  }
  if (friendId === user.id) {
    return undefined
  }

  const isFriend = user.friends.includes(friendId)
  const handleClick = () =>
    isFriend
      ? removeFriend({ userId: user.id, friendId })
      : addFriend({ userId: user.id, friendId })

  return (
    <Button
      variant={isFriend ? 'secondary' : 'accent'}
      size="small"
      onClick={handleClick}
      isBusy={isAdding || isRemoving}
    >
      {isFriend ? '− remove friend' : '+ add friend'}
    </Button>
  )
}
