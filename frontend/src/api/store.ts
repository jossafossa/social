import { configureStore, isRejectedWithValue, type Middleware } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { api } from './api'
import { pb } from './pocketbase'
import { showToast, toastsSlice } from './toastsSlice'

const isMutation = (arg: unknown) =>
  typeof arg === 'object' && arg !== null && 'type' in arg && arg.type === 'mutation'

// Failed mutations surface as a toast. Failed queries already render inline through QueryStatus.
const mutationErrorToasts: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (
      isRejectedWithValue(action) &&
      isMutation(action.meta.arg) &&
      typeof action.payload === 'string'
    ) {
      dispatch(showToast({ message: action.payload, variant: 'error' }))
    }
    return next(action)
  }

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [toastsSlice.name]: toastsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, mutationErrorToasts),
})

// Logging in, out or into another account changes what every cached list shows (own likes, the
// home feed), so start over. A token refresh or saving your own profile keeps the same user: no reset.
let cachedUserId = pb.authStore.record?.id
pb.authStore.onChange((_token, record) => {
  if (record?.id !== cachedUserId) {
    cachedUserId = record?.id
    store.dispatch(api.util.resetApiState())
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
