import { useState } from 'react'
import type { FeedPost } from '~/api'
import { Button, PostCard, Stack } from '~/components'
import { useCurrentUser, useFocusReturn } from '~/hooks'
import { EditPostForm } from '../EditPostForm'
import { LikeButton } from '../LikeButton'
import { PostComments } from '../PostComments'
import { ReportButton } from '../ReportButton'

type PostItemProps = {
  post: FeedPost
}

type Mode = 'reading' | 'editing'

const toCommentsLabel = (comments: number) =>
  comments === 1 ? '1 comment' : `${comments} comments`

export const PostItem = ({ post }: PostItemProps) => {
  const user = useCurrentUser()
  const [mode, setMode] = useState<Mode>('reading')
  const [isShowingComments, setIsShowingComments] = useState(false)

  const editButtonRef = useFocusReturn<HTMLButtonElement>(mode === 'editing')

  const isOwnPost = user !== undefined && post.author === user.id
  const canReport = user !== undefined && !isOwnPost

  const handleEdit = () => setMode('editing')
  const handleCloseEdit = () => setMode('reading')
  const handleToggleComments = () => setIsShowingComments(!isShowingComments)

  if (mode === 'editing') {
    return (
      <PostCard
        post={post}
        badge="editing"
        body={<EditPostForm post={post} onClose={handleCloseEdit} />}
      />
    )
  }

  return (
    <PostCard post={post}>
      <Stack direction="row">
        <LikeButton post={post} />
        <Button
          variant={isShowingComments ? 'primary' : 'secondary'}
          size="small"
          aria-expanded={isShowingComments}
          data-post-action="comments"
          shortcut={['c']}
          isPostShortcut
          aria-keyshortcuts="c"
          onClick={handleToggleComments}
        >
          {isShowingComments ? 'hide comments' : toCommentsLabel(post.comments)}
        </Button>
        {isOwnPost && (
          <Button
            ref={editButtonRef}
            size="small"
            data-post-action="edit"
            shortcut={['e']}
            isPostShortcut
            aria-keyshortcuts="e"
            onClick={handleEdit}
          >
            edit
          </Button>
        )}
        {canReport && <ReportButton postId={post.id} />}
      </Stack>
      {isShowingComments && <PostComments postId={post.id} commentCount={post.comments} />}
    </PostCard>
  )
}
