import classNames from 'classnames'
import { useId, useState, type ChangeEvent, type ComponentProps } from 'react'
import fieldStyles from '~/styles/field.module.scss'
import styles from './TextArea.module.scss'

type TextAreaProps = ComponentProps<'textarea'> & {
  label: string
  hint?: string
  error?: string
  // For a field whose placeholder already says what it is: the label stays for screen readers.
  isLabelHidden?: boolean
}

export const TextArea = ({
  label,
  hint,
  error,
  isLabelHidden = false,
  maxLength,
  className,
  onChange,
  ...props
}: TextAreaProps) => {
  const errorId = useId()
  // Uncontrolled (the form registers it), so the count follows the typing itself.
  const [length, setLength] = useState(String(props.value ?? props.defaultValue ?? '').length)

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLength(event.target.value.length)
    onChange?.(event)
  }

  return (
    <label className={fieldStyles.field}>
      <span className={classNames(isLabelHidden && fieldStyles.hiddenLabel)}>
        {label} {hint && <span className={fieldStyles.hint}>{hint}</span>}
      </span>
      <textarea
        className={classNames(
          fieldStyles.control,
          styles.textarea,
          error && fieldStyles.invalid,
          className,
        )}
        maxLength={maxLength}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        onChange={handleChange}
        {...props}
      />
      <span className={styles.footer}>
        {error && (
          <span id={errorId} className={fieldStyles.error}>
            {error}
          </span>
        )}
        {maxLength !== undefined && (
          <span className={classNames(fieldStyles.hint, styles.counter)}>
            {length} / {maxLength}
          </span>
        )}
      </span>
    </label>
  )
}
