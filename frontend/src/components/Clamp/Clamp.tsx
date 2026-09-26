import classNames from 'classnames'
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Stack } from '../Stack'
import styles from './Clamp.module.scss'

type ClampProps = {
  children: ReactNode
  lines?: number
}

// Caps its content at a number of lines, with "read more" / "read less" below. The toggle only
// shows when the content really is longer.
export const Clamp = ({ children, lines = 10 }: ClampProps) => {
  const contentId = useId()
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)

  // Measured while collapsed only: expanded, nothing overflows, and "read less" has to stay.
  useEffect(() => {
    // The cap sits on the child (see the styles), so that is what overflows.
    const capped = contentRef.current?.firstElementChild
    if (!capped || isExpanded) {
      return
    }
    const observer = new ResizeObserver(() =>
      setIsOverflowing(capped.scrollHeight > capped.clientHeight + 1),
    )
    observer.observe(capped)
    return () => observer.disconnect()
  }, [isExpanded])

  const handleToggle = () => setIsExpanded(!isExpanded)

  return (
    <Stack gap="none" align="start">
      <div
        ref={contentRef}
        id={contentId}
        className={classNames(
          styles.content,
          !isExpanded && styles.clamped,
          !isExpanded && isOverflowing && styles.faded,
        )}
        style={{ '--lines': lines } as CSSProperties}
      >
        {children}
      </div>
      {isOverflowing && (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={handleToggle}
        >
          {isExpanded ? 'read less' : 'read more'}
        </button>
      )}
    </Stack>
  )
}
