import classNames from 'classnames'
import { useId, type ComponentProps } from 'react'
import fieldStyles from '~/styles/field.module.scss'
import styles from './TextField.module.scss'

type TextFieldProps = ComponentProps<'input'> & {
  label: string
  hint?: string
  error?: string
}

export const TextField = ({ label, hint, error, className, ...props }: TextFieldProps) => {
  const errorId = useId()

  return (
    <label className={fieldStyles.field}>
      <span>
        {label} {hint && <span className={fieldStyles.hint}>{hint}</span>}
      </span>
      <input
        className={classNames(
          fieldStyles.control,
          styles.input,
          error && fieldStyles.invalid,
          className,
        )}
        aria-invalid={error !== undefined}
        aria-describedby={error && errorId}
        {...props}
      />
      {error && (
        <span id={errorId} className={fieldStyles.error}>
          {error}
        </span>
      )}
    </label>
  )
}
