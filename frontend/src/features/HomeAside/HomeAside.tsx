import { skipToken } from '@reduxjs/toolkit/query'
import { Link, useNavigate } from 'react-router'
import {
  getFileUrl,
  useGetFriendsInfiniteQuery,
  useGetGroupsByIdsQuery,
  useGetMembershipsQuery,
  useGetUsersByIdsInfiniteQuery,
  type Group,
  type UserProfile,
} from '~/api'
import { Heading, LinkList, SearchBar, Stack, Text } from '~/components'
import { useCurrentUser, useGuestFollows } from '~/hooks'
import { paths } from '~/paths'
import { flattenPages } from '~/utils'

const asideFriendCount = 5

const toGroupItem = (group: Pick<Group, 'id' | 'name'>) => ({
  id: group.id,
  label: `#${group.name.toLowerCase()}`,
  to: paths.group(group.id),
})

const toPersonItem = (person: UserProfile) => ({
  id: person.id,
  label: person.name,
  to: paths.user(person.id),
  avatar: { name: person.name, src: getFileUrl(person, person.avatar, '64x64') },
})

// Members see their groups and friends; visitors the people and groups they follow.
export const HomeAside = () => {
  const user = useCurrentUser()
  const follows = useGuestFollows()
  const navigate = useNavigate()
  const isGuest = user === undefined

  const { data: memberships } = useGetMembershipsQuery(user?.id ?? skipToken)
  const { data: friendPages } = useGetFriendsInfiniteQuery(user?.id ?? skipToken)
  const { data: followedGroups } = useGetGroupsByIdsQuery(
    isGuest && follows.groupIds.length > 0 ? follows.groupIds : skipToken,
  )
  const { data: followedPages } = useGetUsersByIdsInfiniteQuery(
    isGuest && follows.userIds.length > 0 ? follows.userIds : skipToken,
  )

  const groupItems = isGuest
    ? (followedGroups ?? []).map(toGroupItem)
    : (memberships ?? []).flatMap(({ expand }) =>
        expand?.group ? [toGroupItem(expand.group)] : [],
      )
  const peopleItems = (flattenPages(isGuest ? followedPages : friendPages) ?? [])
    .slice(0, asideFriendCount)
    .map(toPersonItem)

  const handleSearch = (query: string) =>
    navigate(query === '' ? paths.friends : `${paths.friends}?q=${encodeURIComponent(query)}`)

  return (
    <>
      <LinkList
        title={isGuest ? 'groups you follow' : 'your groups'}
        items={groupItems}
        emptyText={isGuest ? 'not following any groups' : 'no groups yet'}
      >
        <Text size="small">
          <Link to={paths.groups}>browse all →</Link>
        </Text>
      </LinkList>
      <LinkList
        title={isGuest ? 'following' : 'friends'}
        items={peopleItems}
        emptyText={isGuest ? 'not following anyone' : 'no friends yet'}
      >
        <Text size="small">
          <Link to={paths.friends}>{isGuest ? 'everyone you follow →' : 'all friends →'}</Link>
        </Text>
      </LinkList>
      <Stack as="section" gap="medium">
        <Heading level={2}>find people</Heading>
        <SearchBar label="Find people" variant="compact" onSearch={handleSearch} />
      </Stack>
    </>
  )
}
