import { Kbd } from '../Kbd'
import styles from './PromptButton.module.scss'

type PromptButtonProps = {
  prompt: string
  actionLabel: string
  onClick: () => void
  shortcutKey?: string
}

export const PromptButton = ({ prompt, actionLabel, onClick, shortcutKey }: PromptButtonProps) => (
  <button
    type="button"
    className={styles.prompt}
    data-shortcut={shortcutKey}
    aria-keyshortcuts={shortcutKey}
    onClick={onClick}
  >
    <span>$ {prompt}</span>
    <span className={styles.end}>
      {shortcutKey && <Kbd keys={[shortcutKey]} />}
      <span className={styles.action}>{actionLabel}</span>
    </span>
  </button>
)
