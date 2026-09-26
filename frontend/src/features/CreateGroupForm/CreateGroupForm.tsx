import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateGroupMutation, type Group } from '~/api'
import { Button, ButtonLink, FileField, Form, Stack, TextField } from '~/components'
import { useAuthenticatedUser } from '~/hooks'
import { paths } from '~/paths'
import { cancelShortcut, optionalImageSchema, submitShortcut } from '~/utils'

const createGroupSchema = z.object({
  name: z.string().trim().min(1, 'name the group').max(100, 'keep it under 100 characters'),
  image: optionalImageSchema,
})

type CreateGroupInput = z.input<typeof createGroupSchema>
type CreateGroupValues = z.output<typeof createGroupSchema>

type CreateGroupFormProps = {
  onCreated: (group: Group) => void
}

export const CreateGroupForm = ({ onCreated }: CreateGroupFormProps) => {
  const user = useAuthenticatedUser()
  const [createGroup, { isLoading }] = useCreateGroupMutation()
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CreateGroupInput, unknown, CreateGroupValues>({
    resolver: zodResolver(createGroupSchema),
  })

  // This page exists to fill in this form, so start in its first field.
  useEffect(() => setFocus('name'), [setFocus])

  const handleValidSubmit = async ({ name, image }: CreateGroupValues) => {
    const result = await createGroup({ userId: user.id, name, image })
    if (result.data) {
      onCreated(result.data)
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <TextField
        label="name"
        placeholder="e.g. cats"
        error={errors.name?.message}
        {...register('name')}
      />
      <FileField
        label="choose an image"
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
          CREATE GROUP
        </Button>
        <ButtonLink
          to={paths.groups}
          data-cancel
          shortcut={cancelShortcut.keys}
          aria-keyshortcuts={cancelShortcut.aria}
        >
          cancel
        </ButtonLink>
      </Stack>
    </Form>
  )
}
