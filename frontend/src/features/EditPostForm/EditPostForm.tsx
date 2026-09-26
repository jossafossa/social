import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUpdatePostMutation, type Post } from '~/api'
import { Button, Form, MarkdownEditor, Stack } from '~/components'
import { cancelShortcut, contentSchema, submitShortcut } from '~/utils'

const editPostSchema = z.object({ content: contentSchema })

type EditPostValues = z.infer<typeof editPostSchema>

type EditPostFormProps = {
  post: Post
  onClose: () => void
}

export const EditPostForm = ({ post, onClose }: EditPostFormProps) => {
  const [updatePost, { isLoading }] = useUpdatePostMutation()
  const {
    handleSubmit,
    setFocus,
    control,
    formState: { errors },
  } = useForm<EditPostValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: { content: post.content },
  })

  // Opened by a click on purpose, so the text box takes focus.
  useEffect(() => setFocus('content'), [setFocus])

  const handleValidSubmit = async ({ content }: EditPostValues) => {
    const result = await updatePost({ postId: post.id, content })
    if (!result.error) {
      onClose()
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <MarkdownEditor
            label="edit post"
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
          SAVE
        </Button>
        <Button
          data-cancel
          shortcut={cancelShortcut.keys}
          aria-keyshortcuts={cancelShortcut.aria}
          size="small"
          onClick={onClose}
        >
          cancel
        </Button>
      </Stack>
    </Form>
  )
}
