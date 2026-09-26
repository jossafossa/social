type IconName = 'heart' | 'heart-filled' | 'image' | 'comment'

type IconProps = {
  name: IconName
  size?: number
}

const heartPath = 'M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z'

export const Icon = ({ name, size = 16 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={name === 'heart-filled' ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    {(name === 'heart' || name === 'heart-filled') && <path d={heartPath} />}
    {name === 'comment' && <path d="M21 12a8 8 0 0 1-12 7l-5 1 1-4a8 8 0 1 1 16-4z" />}
    {name === 'image' && (
      <>
        <rect x="3" y="5" width="18" height="14" />
        <circle cx="9" cy="10" r="2" />
        <path d="M21 17l-6-6-8 8" />
      </>
    )}
  </svg>
)
