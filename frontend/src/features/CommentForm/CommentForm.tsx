import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateCommentMutation } from '~/api'
import { Button, Form, MarkdownEditor, Stack } from '~/components'
import { useAuthenticatedUser } from '~/hooks'
import { cancelShortcut, contentSchema, submitShortcut } from '~/utils'

const commentSchema = z.object({ content: contentSchema })

type CommentValues = z.infer<typeof commentSchema>

type CommentFormProps = {
  postId: string
  onSuccess: () => void
  onCancel: () => void
}

export const CommentForm = ({ postId, onSuccess, onCancel }: CommentFormProps) => {
  const user = useAuthenticatedUser()
  const [createComment, { isLoading }] = useCreateCommentMutation()
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CommentValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  })

  // Opened by a click on purpose, so the text box takes focus.
  useEffect(() => setFocus('content'), [setFocus])

  const handleValidSubmit = async ({ content }: CommentValues) => {
    const result = await createComment({ postId, authorId: user.id, content })
    if (!result.error) {
      onSuccess()
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <MarkdownEditor
            label="reply"
            isLabelHidden
            placeholder="write a reply…"
            size="compact"
            maxLength={1000}
            error={errors.content?.message}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
      <Stack direction="row">
        <Button
          type="submit"
          shortcut={submitShortcut.keys}
          aria-keyshortcuts={submitShortcut.aria}
          variant="primary"
          size="small"
          isBusy={isLoading}
        >
          reply
        </Button>
        <Button
          variant="plain"
          data-cancel
          shortcut={cancelShortcut.keys}
          aria-keyshortcuts={cancelShortcut.aria}
          size="small"
          onClick={onCancel}
        >
          cancel
        </Button>
      </Stack>
    </Form>
  )
}
