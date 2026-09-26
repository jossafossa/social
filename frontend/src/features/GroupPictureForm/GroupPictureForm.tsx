import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUpdateGroupImageMutation } from '~/api'
import { Button, FileField, Form, Stack } from '~/components'
import { cancelShortcut, requiredImageSchema, submitShortcut } from '~/utils'

const groupPictureSchema = z.object({ image: requiredImageSchema })

type GroupPictureInput = z.input<typeof groupPictureSchema>
type GroupPictureValues = z.output<typeof groupPictureSchema>

type GroupPictureFormProps = {
  groupId: string
  onSuccess: () => void
  onCancel: () => void
}

export const GroupPictureForm = ({ groupId, onSuccess, onCancel }: GroupPictureFormProps) => {
  const [updateGroupImage, { isLoading }] = useUpdateGroupImageMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupPictureInput, unknown, GroupPictureValues>({
    resolver: zodResolver(groupPictureSchema),
  })

  const handleValidSubmit = async ({ image }: GroupPictureValues) => {
    if (!image) {
      return
    }
    const result = await updateGroupImage({ groupId, image })
    if (!result.error) {
      onSuccess()
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <FileField
        label="new picture…"
        hint="jpg, png or webp · shrunk to 512px"
        accept="image/*"
        error={errors.image?.message}
        {...register('image')}
      />
      <Stack direction="row">
        <Button
          type="submit"
          shortcut={submitShortcut.keys}
          aria-keyshortcuts={submitShortcut.aria}
          variant="accent"
          isBusy={isLoading}
        >
          UPLOAD
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
