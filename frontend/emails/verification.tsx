import { EmailButton } from './_components/EmailButton'
import { EmailLayout } from './_components/EmailLayout'
import { EmailText } from './_components/EmailText'

// PocketBase fills in the {PLACEHOLDERS} when it sends. The route is the app's
// (src/paths.ts confirmEmail): keep them in step.
const VerificationEmail = () => (
  <EmailLayout
    title="confirm email"
    preview="one click and you can post, comment and like."
    footer="didn't sign up? ignore this email and nothing happens."
  >
    <EmailText>hi {'{RECORD:name}'},</EmailText>
    <EmailText>
      welcome to pb/social. confirm your email address and you can post, comment and like.
    </EmailText>
    <EmailButton href="{APP_URL}/confirm-email/{TOKEN}" label="confirm email" />
  </EmailLayout>
)

export default VerificationEmail
