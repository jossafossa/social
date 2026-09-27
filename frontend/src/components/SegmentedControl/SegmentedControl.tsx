import classNames from 'classnames'
import { useId } from 'react'
import styles from './SegmentedControl.module.scss'

type SegmentedControlProps<Value extends string> = {
  legend: string
  options: readonly Value[]
  value: Value
  onChange: (value: Value) => void
  // Stacked puts the legend above the options, for narrow columns like the sidebar.
  layout?: 'inline' | 'stacked'
}

// A row of options, one picked. Native radios: one Tab stop per group, arrow keys pick an option.
export const SegmentedControl = <Value extends string>({
  legend,
  options,
  value,
  onChange,
  layout = 'inline',
}: SegmentedControlProps<Value>) => {
  const name = useId()
  return (
    <fieldset className={classNames(styles.group, styles[layout])}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option} className={styles.option}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={option === value}
              className={styles.input}
              onChange={() => onChange(option)}
            />
            <span className={styles.face}>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
