export const flattenPages = <Item>(data: { pages: { items: Item[] }[] } | undefined) =>
  data?.pages.flatMap(({ items }) => items)
