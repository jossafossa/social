import { useGetGroupQuery } from '~/api'

type GroupCrumbProps = {
  groupId: string
}

// Same query and argument as the group page, so this reads the cache instead of fetching again.
export const GroupCrumb = ({ groupId }: GroupCrumbProps) => {
  const { data: group } = useGetGroupQuery(groupId)
  if (!group) {
    return '…'
  }
  const tag = `#${group.name.toLowerCase()}`
  // The trail cuts long names off; the title keeps the full one reachable.
  return <span title={tag}>{tag}</span>
}
