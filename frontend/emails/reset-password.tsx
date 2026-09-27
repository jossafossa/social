import { EmailButton } from './_components/EmailButton'
import { EmailLayout } from './_components/EmailLayout'
import { EmailText } from './_components/EmailText'

// Route: src/paths.ts resetPassword. Keep them in step.
const ResetPasswordEmail = () => (
  <EmailLayout
    title="new password"
    preview="choose a new password for your pb/social account."
    footer="didn't ask for this? ignore this email: your password stays the same."
  >
    <EmailText>hi {'{RECORD:name}'},</EmailText>
    <EmailText>someone asked to reset the password of your pb/social account.</EmailText>
    <EmailButton href="{APP_URL}/reset-password/{TOKEN}" label="set new password" />
  </EmailLayout>
)

export default ResetPasswordEmail
