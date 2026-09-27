import { getErrorMessage } from '~/utils'
import { LoadingState } from '../LoadingState'
import { Message } from '../Message'

type QueryStatusProps = {
  isLoading: boolean
  error?: unknown
}

export const QueryStatus = ({ isLoading, error }: QueryStatusProps) => {
  if (error) {
    return <Message variant="error">{getErrorMessage(error)}</Message>
  }
  if (isLoading) {
    return <LoadingState />
  }
  return undefined
}
