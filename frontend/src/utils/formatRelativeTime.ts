const minute = 60 * 1000
const hour = 60 * minute
const day = 24 * hour

// Terse ages for dense lists ("now", "5m", "3h", "2d"); older than a week falls back to the date.
export const formatRelativeTime = (isoDate: string, now = Date.now()) => {
  const age = now - new Date(isoDate).getTime()
  if (age < minute) {
    return 'now'
  }
  if (age < hour) {
    return `${Math.floor(age / minute)}m`
  }
  if (age < day) {
    return `${Math.floor(age / hour)}h`
  }
  if (age < 7 * day) {
    return `${Math.floor(age / day)}d`
  }
  return new Date(isoDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}
