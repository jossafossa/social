import { pb } from '~/api'

// Clearing the auth store also resets the API cache (see store.ts).
export const useLogout = () => () => pb.authStore.clear()
