import { getErrorMessage } from '~/utils'
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
    return <Message variant="status">Loading…</Message>
  }
  return undefined
}
