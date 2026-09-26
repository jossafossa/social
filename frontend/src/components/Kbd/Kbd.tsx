import classNames from 'classnames'
import styles from './Kbd.module.scss'

type KbdProps = {
  keys: string[]
  variant?: 'default' | 'inline' | 'compact'
  isPostHint?: boolean
}

// One badge per key, so "⌘ ↵" and "Ctrl Enter" read as two keys. `inline` takes its colours from
// its parent, so it works on any button background. `compact` is the small badge on a button's corner.
export const Kbd = ({ keys, variant = 'default', isPostHint = false }: KbdProps) => (
  <span className={styles.group} data-post-hint={isPostHint || undefined}>
    {keys.map((key) => (
      <kbd key={key} className={classNames(styles.key, styles[variant])}>
        {key}
      </kbd>
    ))}
  </span>
)
