import { useId } from 'react'
import { postPeriods, postSorts, type PostPeriod, type PostSort } from '~/utils'
import { Stack } from '../Stack'
import styles from './FeedControls.module.scss'

type FeedControlsProps = {
  sort: PostSort
  period: PostPeriod
  onSortChange: (sort: PostSort) => void
  onPeriodChange: (period: PostPeriod) => void
}

type SegmentedProps<Value extends string> = {
  legend: string
  options: readonly Value[]
  value: Value
  onChange: (value: Value) => void
}

// Native radios: one Tab stop per group, arrow keys pick an option.
const Segmented = <Value extends string>({
  legend,
  options,
  value,
  onChange,
}: SegmentedProps<Value>) => {
  const name = useId()
  return (
    <fieldset className={styles.group}>
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

export const FeedControls = ({ sort, period, onSortChange, onPeriodChange }: FeedControlsProps) => (
  <Stack direction="row" gap="medium" className={styles.controls}>
    <Segmented legend="sort" options={postSorts} value={sort} onChange={onSortChange} />
    <Segmented
      legend="from the last"
      options={postPeriods}
      value={period}
      onChange={onPeriodChange}
    />
  </Stack>
)
