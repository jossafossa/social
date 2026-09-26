import classNames from 'classnames'
import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type ReactNode,
} from 'react'
import fieldStyles from '~/styles/field.module.scss'
import { Icon } from '../Icon'
import styles from './FileField.module.scss'

type FileFieldProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: string
  hint?: string
  error?: string
  // What is there now (the current avatar), until a new file is picked.
  preview?: ReactNode
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

type Picked = { file: File; url?: string }

export const FileField = ({ label, hint, error, preview, onChange, ...props }: FileFieldProps) => {
  const errorId = useId()
  const [picked, setPicked] = useState<Picked>()
  const [isDragging, setIsDragging] = useState(false)

  // An object URL holds the file in memory until it is revoked: when another file replaces it, or
  // the field goes away.
  useEffect(
    () => () => {
      if (picked?.url) {
        URL.revokeObjectURL(picked.url)
      }
    },
    [picked],
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0) ?? undefined
    setIsDragging(false)
    setPicked(
      file && {
        file,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      },
    )
    onChange?.(event)
  }
  const handleDragEnter = () => setIsDragging(true)
  const handleDragLeave = () => setIsDragging(false)

  return (
    <span className={styles.wrapper}>
      <label
        className={classNames(
          styles.dropzone,
          isDragging && styles.dragging,
          error && styles.invalid,
        )}
      >
        {picked?.url && <img src={picked.url} alt="" className={styles.picked} />}
        {!picked?.url &&
          (preview ?? (
            <span className={styles.preview}>
              <Icon name="image" size={28} />
            </span>
          ))}
        <span className={styles.text}>
          <strong>{label}</strong>
          {picked ? (
            <span className={styles.fileName}>
              {picked.file.name} · {formatSize(picked.file.size)}
            </span>
          ) : (
            <span className={fieldStyles.hint}>click or drop a file here</span>
          )}
          {hint && <span className={fieldStyles.hint}>{hint}</span>}
        </span>
        {/* Covers the whole zone, invisibly: a native file input takes clicks and drops itself. */}
        <input
          type="file"
          className={styles.input}
          aria-invalid={error !== undefined}
          aria-describedby={error && errorId}
          onChange={handleChange}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDragLeave}
          {...props}
        />
      </label>
      {error && (
        <span id={errorId} className={classNames(fieldStyles.error, styles.error)}>
          {error}
        </span>
      )}
    </span>
  )
}
