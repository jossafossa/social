import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { store } from '~/api'
import { Toasts } from '~/features'
import { useFormShortcuts, useInputModality } from '~/hooks'
import { router } from '~/router'

export const App = () => {
  useFormShortcuts()
  useInputModality()

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toasts />
    </Provider>
  )
}
