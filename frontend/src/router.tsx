import { createBrowserRouter } from 'react-router'
import { FriendsCrumb, GroupCrumb, UserCrumb, type CrumbHandle } from '~/features'
import {
  AppLayout,
  AuthLayout,
  ConfirmEmailPage,
  CreateGroupPage,
  ErrorPage,
  ForgotPasswordPage,
  FriendsPage,
  GroupPage,
  GroupsPage,
  GuestLayout,
  HomePage,
  LoginPage,
  MembersOnly,
  NotFoundPage,
  RegisterPage,
  ResetPasswordPage,
  SearchPage,
  SettingsPage,
  UserPage,
} from '~/pages'
import { paths } from '~/paths'

const trail = (crumbs: CrumbHandle['crumbs']): CrumbHandle => ({ crumbs })

const friendsCrumb = { id: 'friends', label: <FriendsCrumb />, to: paths.friends }
const groupsCrumb = { id: 'groups', label: 'groups', to: paths.groups }

export const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          {
            path: paths.login,
            element: <LoginPage />,
            handle: trail(() => [{ id: 'login', label: 'login' }]),
          },
          {
            path: paths.register,
            element: <RegisterPage />,
            handle: trail(() => [{ id: 'signup', label: 'signup' }]),
          },
          {
            path: paths.forgotPassword,
            element: <ForgotPasswordPage />,
            handle: trail(() => [{ id: 'reset', label: 'reset password' }]),
          },
        ],
      },
      // Email links: they work logged in or out.
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.confirmEmail(':token'),
            element: <ConfirmEmailPage />,
            handle: trail(() => [{ id: 'confirm', label: 'confirm email' }]),
          },
          {
            path: paths.resetPassword(':token'),
            element: <ResetPasswordPage />,
            handle: trail(() => [{ id: 'reset', label: 'new password' }]),
          },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: paths.home, element: <HomePage />, handle: trail(() => []) },
          { path: paths.friends, element: <FriendsPage />, handle: trail(() => [friendsCrumb]) },
          {
            path: paths.user(':userId'),
            element: <UserPage />,
            handle: trail(({ userId = '' }) => [
              friendsCrumb,
              { id: 'user', label: <UserCrumb userId={userId} /> },
            ]),
          },
          { path: paths.groups, element: <GroupsPage />, handle: trail(() => [groupsCrumb]) },
          {
            path: paths.group(':groupId'),
            element: <GroupPage />,
            handle: trail(({ groupId = '' }) => [
              groupsCrumb,
              { id: 'group', label: <GroupCrumb groupId={groupId} /> },
            ]),
          },
          {
            path: paths.search,
            element: <SearchPage />,
            handle: trail(() => [{ id: 'search', label: 'search' }]),
          },
          {
            element: <MembersOnly />,
            children: [
              {
                path: paths.newGroup,
                element: <CreateGroupPage />,
                handle: trail(() => [groupsCrumb, { id: 'new', label: 'new' }]),
              },
              {
                path: paths.settings,
                element: <SettingsPage />,
                handle: trail(() => [{ id: 'settings', label: 'settings' }]),
              },
            ],
          },
          {
            path: '*',
            element: <NotFoundPage />,
            handle: trail(() => [{ id: '404', label: '404' }]),
          },
        ],
      },
    ],
  },
])
