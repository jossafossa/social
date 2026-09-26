import { useSearchParams } from 'react-router'
import { parsePostPeriod, parsePostSort, type PostPeriod, type PostSort } from '~/utils'

// A feed's sort and period live in the URL, so a reload or a shared link keeps them. Defaults stay
// out of the URL.
export const useFeedOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = parsePostSort(searchParams.get('sort'))
  const period = parsePostPeriod(searchParams.get('period'))

  const setParam = (key: string, value: string, defaultValue: string) =>
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value === defaultValue) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
        return next
      },
      { replace: true, preventScrollReset: true },
    )

  const setSort = (nextSort: PostSort) => setParam('sort', nextSort, 'new')
  const setPeriod = (nextPeriod: PostPeriod) => setParam('period', nextPeriod, 'all')

  return { sort, period, setSort, setPeriod }
}
