import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useLoginMutation } from '~/api'
import { Button, Form, TextField } from '~/components'
import { emailSchema, submitShortcut } from '~/utils'

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'enter your password'),
})

type LoginValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const handleValidSubmit = (values: LoginValues) => login(values)

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <TextField
        label="email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="password"
        type="password"
        autoComplete="current-password"
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
        LOG IN →
      </Button>
    </Form>
  )
}
