import { useReportPostMutation } from '~/api'
import { Button } from '~/components'
import { useAuthenticatedUser } from '~/hooks'

type ReportButtonProps = {
  postId: string
}

// Enough reports from established accounts hide the post until a moderator looks (pb_hooks/spam.js).
export const ReportButton = ({ postId }: ReportButtonProps) => {
  const user = useAuthenticatedUser()
  const [reportPost, { isLoading, isSuccess }] = useReportPostMutation()

  const handleClick = () => {
    if (!window.confirm('Report this post as spam or abuse?')) {
      return
    }
    reportPost({ postId, reporterId: user.id })
  }

  return (
    <Button variant="plain" size="small" onClick={handleClick} isBusy={isLoading}>
      {isSuccess ? 'reported' : 'report'}
    </Button>
  )
}
