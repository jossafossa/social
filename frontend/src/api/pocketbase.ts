import PocketBase, { ClientResponseError } from 'pocketbase'
import type { Comment, FileOwner, Group, Like, Membership, Post, Report, User } from './types'

// Defaults to the page's own origin, which is where PocketBase serves the built app from pb_public.
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL ?? window.location.origin)

// The SDK cancels duplicate in-flight requests by default, which trips on StrictMode's double effects.
pb.autoCancellation(false)

export const usersCollection = pb.collection<User>('users')
export const groupsCollection = pb.collection<Group>('groups')
export const membershipsCollection = pb.collection<Membership>('memberships')
export const postsCollection = pb.collection<Post>('posts')
export const likesCollection = pb.collection<Like>('likes')
export const commentsCollection = pb.collection<Comment>('comments')
export const reportsCollection = pb.collection<Report>('reports')

// The saved user is a snapshot from login: it misses fields added since and edits made elsewhere,
// so reload it before the first render. Only a 401 means the session is gone; a network blip or
// a 429 from the rate limiter keeps the snapshot.
export const restoreSession = async () => {
  if (!pb.authStore.isValid) {
    pb.authStore.clear()
    return
  }
  try {
    await usersCollection.authRefresh()
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 401) {
      pb.authStore.clear()
    }
  }
}

export type Thumb = '64x64' | '192x192'

export const getFileUrl = (record: FileOwner, filename: string, thumb: Thumb) =>
  filename === '' ? undefined : pb.files.getURL(record, filename, { thumb })
