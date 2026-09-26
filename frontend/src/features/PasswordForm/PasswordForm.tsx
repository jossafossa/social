import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useChangePasswordMutation } from '~/api'
import { Button, Form, Message, TextField } from '~/components'
import { useAuthenticatedUser } from '~/hooks'
import { passwordSchema, submitShortcut } from '~/utils'

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'enter your current password'),
  password: passwordSchema,
})

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export const PasswordForm = () => {
  const user = useAuthenticatedUser()
  const [changePassword, { isLoading, isSuccess }] = useChangePasswordMutation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) })

  const handleValidSubmit = async (values: ChangePasswordValues) => {
    const result = await changePassword({ userId: user.id, ...values })
    if (!result.error) {
      reset()
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <TextField
        label="current"
        type="password"
        autoComplete="current-password"
        error={errors.oldPassword?.message}
        {...register('oldPassword')}
      />
      <TextField
        label="new"
        hint="8+ characters"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      {isSuccess && <Message variant="status">password changed</Message>}
      <Button
        type="submit"
        shortcut={submitShortcut.keys}
        aria-keyshortcuts={submitShortcut.aria}
        variant="primary"
        isBusy={isLoading}
      >
        CHANGE PASSWORD
      </Button>
    </Form>
  )
}
