import { Button } from '../Button'
import styles from './LoadMoreButton.module.scss'

type LoadMoreButtonProps = {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  label?: string
}

export const LoadMoreButton = ({
  hasMore,
  isLoading,
  onLoadMore,
  label = 'load more ↓',
}: LoadMoreButtonProps) => {
  if (!hasMore) {
    return undefined
  }
  return (
    <div className={styles.divider}>
      <Button variant="dashed" size="small" onClick={onLoadMore} isBusy={isLoading}>
        {isLoading ? 'loading…' : label}
      </Button>
    </div>
  )
}
