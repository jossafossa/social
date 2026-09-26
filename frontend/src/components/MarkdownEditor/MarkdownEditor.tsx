import { Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, Extension, useEditor, useEditorState, type Editor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import classNames from 'classnames'
import {
  useEffect,
  useId,
  useImperativeHandle,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react'
import fieldStyles from '~/styles/field.module.scss'
import { isMac } from '~/utils'
import styles from './MarkdownEditor.module.scss'

export type MarkdownEditorHandle = { focus: () => void }

type MarkdownEditorProps = {
  label: string
  value: string
  onChange: (markdown: string) => void
  onBlur?: () => void
  placeholder?: string
  error?: string
  // Shows "n / max" under the field. Counts the markdown, as the server does.
  maxLength?: number
  // For a field whose placeholder already says what it is: the label stays for screen readers.
  isLabelHidden?: boolean
  size?: 'compact' | 'regular'
  ref?: Ref<MarkdownEditorHandle>
}

type Tool = {
  label: string
  keys: string
  text: string
  isActive: (editor: Editor) => boolean
  run: (editor: Editor) => void
}

const mod = isMac ? '⌘' : 'Ctrl+'

const tools: Tool[] = [
  {
    label: 'bold',
    keys: `${mod}B`,
    text: 'B',
    isActive: (editor) => editor.isActive('bold'),
    run: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: 'italic',
    keys: `${mod}I`,
    text: 'I',
    isActive: (editor) => editor.isActive('italic'),
    run: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: 'underline',
    keys: `${mod}U`,
    text: 'U',
    isActive: (editor) => editor.isActive('underline'),
    run: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    label: 'strikethrough',
    keys: isMac ? '⌘⇧S' : 'Ctrl+Shift+S',
    text: 'S',
    isActive: (editor) => editor.isActive('strike'),
    run: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    label: 'code',
    keys: `${mod}E`,
    text: '</>',
    isActive: (editor) => editor.isActive('code'),
    run: (editor) => editor.chain().focus().toggleCode().run(),
  },
  {
    label: 'bullet list',
    keys: isMac ? '⌘⇧8' : 'Ctrl+Shift+8',
    text: '•',
    isActive: (editor) => editor.isActive('bulletList'),
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: 'numbered list',
    keys: isMac ? '⌘⇧7' : 'Ctrl+Shift+7',
    text: '1.',
    isActive: (editor) => editor.isActive('orderedList'),
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: 'quote',
    keys: isMac ? '⌘⇧B' : 'Ctrl+Shift+B',
    text: '❝',
    isActive: (editor) => editor.isActive('blockquote'),
    run: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
]

// ⌘/Ctrl+Enter belongs to the form (useFormShortcuts submits it); Tiptap would insert a line break.
// Claimed first and left alone, the key event still bubbles up to the form. Shift+Enter breaks lines.
const leaveSubmitToForm = Extension.create({
  name: 'leaveSubmitToForm',
  priority: 1000,
  addKeyboardShortcuts: () => ({ 'Mod-Enter': () => true }),
})

// Only what the Markdown component renders: no headings, code blocks or rules.
const extensions = (placeholder: string | undefined) => [
  leaveSubmitToForm,
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    horizontalRule: false,
    link: { openOnClick: false, autolink: true },
  }),
  // Plain-text posts from before the editor keep their single line breaks.
  Markdown.configure({ markedOptions: { breaks: true } }),
  Placeholder.configure({ placeholder: placeholder ?? '' }),
]

export const MarkdownEditor = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  maxLength,
  isLabelHidden = false,
  size = 'regular',
  ref,
}: MarkdownEditorProps) => {
  const labelId = useId()
  const errorId = useId()
  const [activeTool, setActiveTool] = useState(0)

  const editor = useEditor({
    extensions: extensions(placeholder),
    content: value,
    contentType: 'markdown',
    immediatelyRender: true,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-labelledby': labelId,
        ...(error ? { 'aria-invalid': 'true', 'aria-describedby': errorId } : {}),
        class: styles.content,
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getMarkdown()),
    onBlur: () => onBlur?.(),
  })

  const activeStates = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      tools.map((tool) => (current ? tool.isActive(current) : false)),
  })

  // The form can change the value itself (reset after posting): put that into the editor.
  useEffect(() => {
    if (editor && value !== editor.getMarkdown()) {
      editor.commands.setContent(value, { contentType: 'markdown', emitUpdate: false })
    }
  }, [editor, value])

  useImperativeHandle(ref, () => ({ focus: () => editor?.commands.focus('end') }), [editor])

  // A toolbar is one Tab stop; the arrow keys move between its buttons.
  const handleToolbarKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (step === undefined) {
      return
    }
    event.preventDefault()
    const next = (activeTool + step + tools.length) % tools.length
    setActiveTool(next)
    event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[next]?.focus()
  }

  return (
    <div className={fieldStyles.field}>
      <span id={labelId} className={classNames(isLabelHidden && fieldStyles.hiddenLabel)}>
        {label}
      </span>
      <div className={classNames(styles.editor, styles[size], error && fieldStyles.invalid)}>
        <div
          role="toolbar"
          tabIndex={-1}
          aria-label={`${label} formatting`}
          className={styles.toolbar}
          onKeyDown={handleToolbarKeyDown}
        >
          {tools.map((tool, index) => (
            <button
              key={tool.label}
              type="button"
              className={styles.tool}
              tabIndex={index === activeTool ? 0 : -1}
              aria-label={tool.label}
              aria-pressed={activeStates?.[index] ?? false}
              title={`${tool.label} (${tool.keys})`}
              // Keep the text selection: a mouse press would otherwise move focus off the editor.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor && tool.run(editor)}
            >
              {tool.text}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
      <span className={styles.footer}>
        {error && (
          <span id={errorId} className={fieldStyles.error}>
            {error}
          </span>
        )}
        {maxLength !== undefined && (
          <span className={classNames(fieldStyles.hint, styles.counter)}>
            {value.length} / {maxLength}
          </span>
        )}
      </span>
    </div>
  )
}
