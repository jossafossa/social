// Markdown has no underline; the editor writes it as ++text++. This turns those spans into <u>, also
// around formatted text (`++**bold**++`). A marker without a partner stays as literal text.
type MarkdownNode = {
  type: string
  value?: string
  children?: MarkdownNode[]
  data?: { hName?: string }
}

const marker = '++'

const wrapUnderlines = (children: MarkdownNode[]): MarkdownNode[] => {
  const result: MarkdownNode[] = []
  let openAt: number | undefined

  const toggle = () => {
    if (openAt === undefined) {
      openAt = result.length
      return
    }
    const inner = result.splice(openAt)
    result.push({ type: 'underline', data: { hName: 'u' }, children: inner })
    openAt = undefined
  }

  for (const child of children) {
    if (child.type !== 'text' || child.value === undefined) {
      result.push(child.children ? { ...child, children: wrapUnderlines(child.children) } : child)
      continue
    }
    child.value.split(marker).forEach((part, index) => {
      if (index > 0) {
        toggle()
      }
      if (part !== '') {
        result.push({ type: 'text', value: part })
      }
    })
  }

  if (openAt !== undefined) {
    result.splice(openAt, 0, { type: 'text', value: marker })
  }
  return result
}

export const remarkUnderline = () => (tree: MarkdownNode) => {
  tree.children = wrapUnderlines(tree.children ?? [])
}
