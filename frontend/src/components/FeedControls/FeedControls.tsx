import { postPeriods, postSorts, type PostPeriod, type PostSort } from '~/utils'
import { SegmentedControl } from '../SegmentedControl'
import { Stack } from '../Stack'
import styles from './FeedControls.module.scss'

type FeedControlsProps = {
  sort: PostSort
  period: PostPeriod
  onSortChange: (sort: PostSort) => void
  onPeriodChange: (period: PostPeriod) => void
}

export const FeedControls = ({ sort, period, onSortChange, onPeriodChange }: FeedControlsProps) => (
  <Stack direction="row" gap="medium" className={styles.controls}>
    <SegmentedControl legend="sort" options={postSorts} value={sort} onChange={onSortChange} />
    <SegmentedControl
      legend="from the last"
      options={postPeriods}
      value={period}
      onChange={onPeriodChange}
    />
  </Stack>
)
