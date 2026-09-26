export const postSorts = ['new', 'likes', 'comments'] as const
export const postPeriods = ['day', 'week', 'month', 'year', 'all'] as const

export type PostSort = (typeof postSorts)[number]
export type PostPeriod = (typeof postPeriods)[number]

const day = 24 * 60 * 60 * 1000
const periodLengths: Record<Exclude<PostPeriod, 'all'>, number> = {
  day,
  week: 7 * day,
  month: 30 * day,
  year: 365 * day,
}

// Rolling windows ("the last week"), in the timestamp format PocketBase stores and compares.
export const toPeriodStart = (period: PostPeriod, now = Date.now()) =>
  period === 'all'
    ? undefined
    : new Date(now - periodLengths[period]).toISOString().replace('T', ' ')

export const parsePostSort = (value: string | null): PostSort =>
  postSorts.find((sort) => sort === value) ?? 'new'

export const parsePostPeriod = (value: string | null): PostPeriod =>
  postPeriods.find((period) => period === value) ?? 'all'
