import type { Group } from '~/api'
import { GroupCard } from '~/components'
import { useCurrentUser, useGuestFollows, useMembership } from '~/hooks'
import { MembershipButton } from '../MembershipButton'

type GroupItemProps = {
  group: Group
}

export const GroupItem = ({ group }: GroupItemProps) => {
  const user = useCurrentUser()
  const { groupIds } = useGuestFollows()
  const { membership } = useMembership(group.id)

  let status = membership ? 'member' : 'not joined'
  if (!user) {
    status = groupIds.includes(group.id) ? 'following' : 'not following'
  }

  return (
    <GroupCard group={group} status={status} actions={<MembershipButton groupId={group.id} />} />
  )
}
