import classNames from 'classnames'
import { Link } from 'react-router'
import truncateStyles from '~/styles/truncate.module.scss'
import styles from './GroupTag.module.scss'

type GroupTagProps = {
  name: string
  to: string
}

export const GroupTag = ({ name, to }: GroupTagProps) => {
  const tag = `#${name.toLowerCase()}`
  return (
    <Link to={to} title={tag} className={classNames(styles.tag, truncateStyles.truncate)}>
      {tag}
    </Link>
  )
}
