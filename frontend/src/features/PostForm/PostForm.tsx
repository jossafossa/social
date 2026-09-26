import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreatePostMutation } from '~/api'
import { Button, Form, MarkdownEditor, Stack } from '~/components'
import { useAuthenticatedUser } from '~/hooks'
import { cancelShortcut, contentSchema, submitShortcut } from '~/utils'

const postSchema = z.object({ content: contentSchema })

type PostValues = z.infer<typeof postSchema>

type PostFormProps = {
  onSuccess: () => void
  onCancel: () => void
  groupId?: string
}

export const PostForm = ({ onSuccess, onCancel, groupId }: PostFormProps) => {
  const user = useAuthenticatedUser()
  const [createPost, { isLoading }] = useCreatePostMutation()
  const {
    handleSubmit,
    setFocus,
    control,
    formState: { errors },
  } = useForm<PostValues>({ resolver: zodResolver(postSchema), defaultValues: { content: '' } })

  // Opened by a click on purpose, so the text box takes focus.
  useEffect(() => setFocus('content'), [setFocus])

  const handleValidSubmit = async ({ content }: PostValues) => {
    const result = await createPost({ authorId: user.id, content, groupId })
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
            label="what's happening?"
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
          isBusy={isLoading}
        >
          POST
        </Button>
        <Button
          data-cancel
          shortcut={cancelShortcut.keys}
          aria-keyshortcuts={cancelShortcut.aria}
          onClick={onCancel}
        >
          cancel
        </Button>
      </Stack>
    </Form>
  )
}
