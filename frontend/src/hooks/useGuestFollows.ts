import { useSyncExternalStore } from 'react'

// Visitors without an account can follow people and groups. It lives in this browser only: nothing
// is sent anywhere, and another device or cleared site data starts empty.
type GuestFollows = { userIds: string[]; groupIds: string[] }

const storageKey = 'guestFollows'
const empty: GuestFollows = { userIds: [], groupIds: [] }
const listeners = new Set<() => void>()

const isIdList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const read = (): GuestFollows => {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'userIds' in parsed &&
      'groupIds' in parsed
    ) {
      const { userIds, groupIds } = parsed
      return {
        userIds: isIdList(userIds) ? userIds : [],
        groupIds: isIdList(groupIds) ? groupIds : [],
      }
    }
  } catch {
    // Blocked or broken storage: start empty.
  }
  return empty
}

// One snapshot object per change, so useSyncExternalStore sees a stable value between changes.
let current = read()

const write = (next: GuestFollows) => {
  current = next
  try {
    localStorage.setItem(storageKey, JSON.stringify(next))
  } catch {
    // Private mode or full storage: follows last until the tab closes.
  }
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  // Another tab changed them.
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) {
      current = read()
      listener()
    }
  }
  listeners.add(listener)
  window.addEventListener('storage', handleStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}

const getSnapshot = () => current

const toggle = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id]

export const useGuestFollows = () => {
  const follows = useSyncExternalStore(subscribe, getSnapshot)
  return {
    ...follows,
    toggleUser: (userId: string) => write({ ...current, userIds: toggle(current.userIds, userId) }),
    toggleGroup: (groupId: string) =>
      write({ ...current, groupIds: toggle(current.groupIds, groupId) }),
  }
}
