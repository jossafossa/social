import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRegisterMutation } from '~/api'
import { Button, Form, TextField, Turnstile } from '~/components'
import { useTheme } from '~/hooks'
import { emailSchema, passwordSchema, submitShortcut } from '~/utils'

// The Docker build passes an empty value when no key is configured.
const configuredSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const turnstileSiteKey = configuredSiteKey === '' ? undefined : configuredSiteKey

const registerSchema = z.object({
  name: z.string().trim().min(1, 'pick a name').max(255, 'keep it under 255 characters'),
  email: emailSchema,
  password: passwordSchema,
  turnstileToken:
    turnstileSiteKey === undefined
      ? z.string().optional()
      : z.string("confirm you're human").min(1, "confirm you're human"),
})

type RegisterValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const [registerUser, { isLoading }] = useRegisterMutation()
  const { theme } = useTheme()
  // A human-check token works once, so a failed attempt needs a fresh check.
  const [attempt, setAttempt] = useState(0)
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const handleValidSubmit = async (values: RegisterValues) => {
    const result = await registerUser(values)
    if (result.error !== undefined) {
      setValue('turnstileToken', undefined)
      setAttempt(attempt + 1)
    }
  }

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
      {turnstileSiteKey !== undefined && (
        <Controller
          control={control}
          name="turnstileToken"
          render={({ field, fieldState }) => (
            <Turnstile
              key={attempt}
              siteKey={turnstileSiteKey}
              onChange={field.onChange}
              theme={theme === 'device' ? 'auto' : theme}
              error={fieldState.error?.message}
            />
          )}
        />
      )}
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
