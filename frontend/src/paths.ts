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
  // Linked from PocketBase's emails (backend/pb_migrations/10_app_email_links.js): keep in step.
  confirmEmail: (token: string) => `/confirm-email/${token}`,
  resetPassword: (token: string) => `/reset-password/${token}`,
}
