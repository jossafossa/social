import type { Comment, Group, Post, UserProfile, UserSummary } from '~/api'

// Story data only. Mirrors the shape PocketBase returns, trimmed the way the api layer trims it.
const userRecord = { collectionId: '_pb_users_auth_', collectionName: 'users', avatar: '' }
const groupRecord = { collectionId: 'groups', collectionName: 'groups', image: '' }

export const alice: UserProfile = { ...userRecord, id: 'alice', name: 'Alice', bio: 'hi im alice' }
export const bob: UserProfile = { ...userRecord, id: 'bob', name: 'bob', bio: '' }
export const dave: UserSummary = { ...userRecord, id: 'dave', name: 'DoeMaarDave' }

export const cats: Group = { ...groupRecord, id: 'cats', name: 'Cats' }
export const dogs: Group = { ...groupRecord, id: 'dogs', name: 'Dogs' }
export const photographers: Group = { ...groupRecord, id: 'photographers', name: 'Photographers' }

const postRecord = { collectionId: 'posts', collectionName: 'posts', likes: 0, comments: 0 }

export const groupPost: Post = {
  ...postRecord,
  id: 'post-1',
  author: dave.id,
  group: cats.id,
  content: 'I love cats',
  created: '2026-09-26T20:17:17Z',
  likes: 1,
  expand: { author: dave, group: cats },
}

export const personalPost: Post = {
  ...postRecord,
  id: 'post-2',
  author: bob.id,
  group: '',
  content: 'bob personal',
  created: '2026-09-26T20:08:05Z',
  comments: 8,
  expand: { author: bob },
}

const commentRecord = {
  collectionId: 'comments',
  collectionName: 'comments',
  post: personalPost.id,
}

export const comments: Comment[] = [
  {
    ...commentRecord,
    id: 'c1',
    author: alice.id,
    content: 'nice one bob',
    created: '2026-09-26T20:09:00Z',
    expand: { author: alice },
  },
  {
    ...commentRecord,
    id: 'c2',
    author: alice.id,
    content: 'comment 1',
    created: '2026-09-26T20:10:00Z',
    expand: { author: alice },
  },
]
