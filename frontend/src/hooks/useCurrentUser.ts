import { useSyncExternalStore } from 'react'
import { pb, type User } from '~/api'

// authStore.record re-parses localStorage on every read, so cache it for a stable snapshot.
let currentUser = (pb.authStore.record as User | null) ?? undefined
pb.authStore.onChange((_token, record) => {
  currentUser = (record as User | null) ?? undefined
})

const subscribe = (onChange: () => void) => pb.authStore.onChange(onChange)

const getSnapshot = () => currentUser

export const useCurrentUser = () => useSyncExternalStore(subscribe, getSnapshot)
