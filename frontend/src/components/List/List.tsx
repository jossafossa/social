import { useRef, type ReactNode } from 'react'
import { EmptyState } from '../EmptyState'
import { LoadMoreButton } from '../LoadMoreButton'
import { useArrowNavigation } from '../useArrowNavigation'
import { useAutoLoadMore } from '../useAutoLoadMore'
import { useLoadMoreFocus } from '../useLoadMoreFocus'
import styles from './List.module.scss'

type LoadMore = {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  // Full-page feeds load the next page by themselves near the end; the button stays for keyboards.
  isAutomatic?: boolean
}

type ListProps<Item extends { id: string }> = {
  items: Item[]
  renderItem: (item: Item) => ReactNode
  emptyText: string
  columns?: 1 | 3
  loadMore?: LoadMore
}

// In a grid (columns={3}) the arrow keys also move between the cards.
export const List = <Item extends { id: string }>({
  items,
  renderItem,
  emptyText,
  columns = 1,
  loadMore,
}: ListProps<Item>) => {
  const listRef = useRef<HTMLUListElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const isGrid = columns === 3
  useArrowNavigation(listRef, columns, isGrid)
  const markLoadMore = useLoadMoreFocus(listRef, items.length, loadMore?.isLoading ?? false)
  // Loading by scrolling leaves focus alone; only the button hands it to the first new item.
  useAutoLoadMore(markerRef, {
    isEnabled: (loadMore?.isAutomatic ?? false) && (loadMore?.hasMore ?? false),
    isLoading: loadMore?.isLoading ?? false,
    onLoadMore: () => loadMore?.onLoadMore(),
  })

  if (items.length === 0) {
    return <EmptyState>{emptyText}</EmptyState>
  }

  const handleLoadMore = () => {
    markLoadMore()
    loadMore?.onLoadMore()
  }

  return (
    <div className={styles.wrapper}>
      <ul ref={listRef} className={isGrid ? styles.grid : styles.list}>
        {items.map((item) => (
          <li key={item.id} data-arrow-item={isGrid || undefined}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
      {loadMore?.isAutomatic && <div ref={markerRef} />}
      {loadMore && (
        <LoadMoreButton
          hasMore={loadMore.hasMore}
          isLoading={loadMore.isLoading}
          onLoadMore={handleLoadMore}
        />
      )}
    </div>
  )
}
