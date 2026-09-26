import classNames from 'classnames'
import { pickSwatch } from '~/utils'
import styles from './Avatar.module.scss'

type AvatarProps = {
  name: string
  size: 'small' | 'medium' | 'large' | 'xlarge'
  src?: string
}

export const Avatar = ({ name, size, src }: AvatarProps) => {
  const className = classNames(styles.avatar, styles[size])
  if (src !== undefined) {
    return <img className={className} src={src} alt="" />
  }
  return (
    <span className={className} style={{ background: pickSwatch(name) }} aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}
