import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useResetPasswordMutation } from '~/api'
import { Button, Form, Message, TextField } from '~/components'
import { passwordSchema, submitShortcut } from '~/utils'

const resetPasswordSchema = z.object({ password: passwordSchema })

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>

type ResetPasswordFormProps = {
  token: string
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) })

  const handleValidSubmit = ({ password }: ResetPasswordValues) =>
    resetPassword({ token, password })

  // The link works once: nothing left to submit.
  if (isSuccess) {
    return <Message variant="status">password changed: log in with it.</Message>
  }

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <TextField
        label="new password"
        hint="8+ characters"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button
        type="submit"
        shortcut={submitShortcut.keys}
        aria-keyshortcuts={submitShortcut.aria}
        variant="accent"
        isBusy={isLoading}
      >
        SET PASSWORD →
      </Button>
    </Form>
  )
}
