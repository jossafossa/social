import type { ComponentProps } from 'react'
import { Stack } from '../Stack'

type FormProps = ComponentProps<'form'>

// Fields stretch themselves; everything else (buttons, messages) keeps its natural width.
// noValidate: the zod schema owns validation, so the browser's own bubbles stay out of the way.
export const Form = ({ children, ...props }: FormProps) => (
  <form noValidate {...props}>
    <Stack gap="medium" align="start">
      {children}
    </Stack>
  </form>
)
