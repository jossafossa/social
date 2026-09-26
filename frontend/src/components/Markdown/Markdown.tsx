import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import styles from './Markdown.module.scss'
import { remarkUnderline } from './remarkUnderline'

type MarkdownProps = {
  children: string
  size?: 'small' | 'body' | 'large'
  tone?: 'default' | 'muted'
}

// What the editor can make. Anything else (headings, images, tables, raw HTML typed in by hand)
// shows as its plain text instead.
const allowedElements = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  'del',
  'code',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
]
const remarkPlugins = [remarkGfm, remarkBreaks, remarkUnderline]

// Posts, comments and bios. Single line breaks stay line breaks, as people typed them.
export const Markdown = ({ children, size = 'body', tone = 'default' }: MarkdownProps) => (
  <div className={classNames(styles.markdown, styles[size], styles[tone])}>
    <ReactMarkdown
      remarkPlugins={remarkPlugins}
      allowedElements={allowedElements}
      unwrapDisallowed
      skipHtml
    >
      {children}
    </ReactMarkdown>
  </div>
)
