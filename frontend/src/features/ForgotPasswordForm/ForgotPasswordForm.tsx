import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRequestPasswordResetMutation } from '~/api'
import { Button, Form, Message, TextField } from '~/components'
import { emailSchema, submitShortcut } from '~/utils'

const forgotPasswordSchema = z.object({ email: emailSchema })

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordForm = () => {
  const [requestPasswordReset, { isLoading, isSuccess }] = useRequestPasswordResetMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const handleValidSubmit = ({ email }: ForgotPasswordValues) => requestPasswordReset(email)

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <TextField
        label="email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      {isSuccess && (
        <Message variant="status">
          if that email has an account, a reset link is on its way.
        </Message>
      )}
      <Button
        type="submit"
        shortcut={submitShortcut.keys}
        aria-keyshortcuts={submitShortcut.aria}
        variant="accent"
        isBusy={isLoading}
      >
        SEND RESET LINK →
      </Button>
    </Form>
  )
}
