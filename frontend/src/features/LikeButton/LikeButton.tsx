import { useLikePostMutation, useUnlikePostMutation, type FeedPost } from '~/api'
import { Button, Icon, Text } from '~/components'
import { useCurrentUser } from '~/hooks'

const toLikeLabel = (likes: number) => {
  if (likes === 0) {
    return 'like'
  }
  return likes === 1 ? '1 like' : `${likes} likes`
}

type LikeButtonProps = {
  post: FeedPost
}

export const LikeButton = ({ post: { id, likes, ownLikeId } }: LikeButtonProps) => {
  const user = useCurrentUser()
  const [likePost, { isLoading: isLiking }] = useLikePostMutation()
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation()

  const isLiked = ownLikeId !== undefined

  // Read-only for a visitor: the count, nothing to press.
  if (!user) {
    return (
      <Text as="span" size="small" tone="muted">
        ♡ {likes === 1 ? '1 like' : `${likes} likes`}
      </Text>
    )
  }

  const handleClick = () => {
    if (ownLikeId) {
      unlikePost({ postId: id, likeId: ownLikeId })
      return
    }
    likePost({ postId: id, userId: user.id })
  }

  return (
    <Button
      variant={isLiked ? 'accent' : 'secondary'}
      size="small"
      onClick={handleClick}
      isBusy={isLiking || isUnliking}
      aria-pressed={isLiked}
      data-post-action="like"
      shortcut={['l']}
      isPostShortcut
      aria-keyshortcuts="l"
    >
      <Icon name={isLiked ? 'heart-filled' : 'heart'} size={14} />
      {toLikeLabel(likes)}
    </Button>
  )
}
