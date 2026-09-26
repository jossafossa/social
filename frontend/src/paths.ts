export const paths = {
  home: '/',
  friends: '/friends',
  user: (userId: string) => `/users/${userId}`,
  groups: '/groups',
  newGroup: '/groups/new',
  group: (groupId: string) => `/groups/${groupId}`,
  settings: '/settings',
  search: '/search',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
}
