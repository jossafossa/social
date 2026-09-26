import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRegisterMutation } from '~/api'
import { Button, Form, TextField } from '~/components'
import { emailSchema, passwordSchema, submitShortcut } from '~/utils'

const registerSchema = z.object({
  name: z.string().trim().min(1, 'pick a name').max(255, 'keep it under 255 characters'),
  email: emailSchema,
  password: passwordSchema,
})

type RegisterValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const [registerUser, { isLoading }] = useRegisterMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const handleValidSubmit = (values: RegisterValues) => registerUser(values)

  return (
    <Form onSubmit={handleSubmit(handleValidSubmit)}>
      <TextField
        label="name"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />
      <TextField
        label="email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        label="password"
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
        CREATE ACCOUNT →
      </Button>
    </Form>
  )
}
