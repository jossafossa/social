import { useMatches, type Params } from 'react-router'
import { Breadcrumbs, type Crumb } from '~/components'

export type CrumbHandle = {
  crumbs: (params: Params) => Crumb[]
}

const hasCrumbs = (handle: unknown): handle is CrumbHandle =>
  typeof handle === 'object' && handle !== null && 'crumbs' in handle

// Each route declares its whole trail in `handle.crumbs`; the deepest route that has one wins.
export const AppBreadcrumbs = () => {
  const matches = useMatches()
  const match = matches.findLast(({ handle }) => hasCrumbs(handle))
  const items = match && hasCrumbs(match.handle) ? match.handle.crumbs(match.params) : []

  return <Breadcrumbs items={items} />
}
