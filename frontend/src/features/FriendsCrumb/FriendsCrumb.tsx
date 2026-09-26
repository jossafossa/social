import { useCurrentUser } from '~/hooks'

// Members have friends; visitors follow people (kept in their browser).
export const FriendsCrumb = () => (useCurrentUser() ? 'friends' : 'following')
