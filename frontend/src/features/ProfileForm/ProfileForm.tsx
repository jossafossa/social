import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getFileUrl, useUpdateUserMutation } from '~/api'
import {
  Avatar,
  Button,
  FileField,
  Form,
  MarkdownEditor,
  Message,
  Stack,
  TextField,
} from '~/components'
import { useAuthenticatedUser } from '~/hooks'
import { optionalImageSchema, submitShortcut } from '~/utils'

const profileSchema = z.object({
  name: z.string().trim().min(1, 'pick a name').max(255, 'keep it under 255 characters'),
  bio: z.string().max(500, 'keep it under 500 characters'),
  avatar: optionalImageSchema,
})

type ProfileInput = z.input<typeof profileSchema>
type ProfileValues = z.output<typeof profileSchema>

export const ProfileForm = () => {
  const user = useAuthenticatedUser()
  const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation()
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileInput, unknown, ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, bio: user.bio },
  })

  const handleValidSubmit = async (values: ProfileValues) => {
    const result = await updateUser({ userId: user.id, ...values })
    if (result.data) {
      reset({ name: result.data.name, bio: result.data.bio })
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <FileField
        label="change picture"
        hint="shrunk to 512px before upload"
        accept="image/*"
        error={errors.avatar?.message}
        preview={
          <Avatar name={user.name} size="large" src={getFileUrl(user, user.avatar, '192x192')} />
        }
        {...register('avatar')}
      />
      <TextField label="name" error={errors.name?.message} {...register('name')} />
      <Controller
        name="bio"
        control={control}
        render={({ field }) => (
          <MarkdownEditor
            label="bio"
            maxLength={500}
            placeholder="say something about yourself"
            error={errors.bio?.message}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
          />
        )}
      />
      <Stack direction="row" gap="medium">
        <Button
          type="submit"
          shortcut={submitShortcut.keys}
          aria-keyshortcuts={submitShortcut.aria}
          variant="primary"
          isBusy={isLoading}
        >
          SAVE PROFILE
        </Button>
        {isSuccess && <Message variant="status">saved</Message>}
      </Stack>
    </Form>
  )
}
