import styles from './LoadingState.module.scss'

type LoadingStateProps = {
  label?: string
}

// Looks like EmptyState, with a blinking terminal cursor. Waits a moment before showing, so a fast
// load never flashes it.
export const LoadingState = ({ label = 'loading' }: LoadingStateProps) => (
  <output className={styles.loading}>
    {label}
    <span className={styles.cursor} aria-hidden="true">
      _
    </span>
  </output>
)
