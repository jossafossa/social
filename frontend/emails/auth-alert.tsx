import { EmailLayout } from './_components/EmailLayout'
import { EmailText } from './_components/EmailText'

// PocketBase sends this after a login from a device or place it hasn't seen for this account.
const AuthAlertEmail = () => (
  <EmailLayout
    title="new login"
    preview="your pb/social account was used from a new location."
    footer="this email is only sent for logins from somewhere new."
  >
    <EmailText>hi {'{RECORD:name}'},</EmailText>
    <EmailText>your pb/social account was just logged in to from a new location:</EmailText>
    <EmailText tone="muted">{'{ALERT_INFO}'}</EmailText>
    <EmailText>
      was this you? then you can ignore this email. if not, change your password in settings right
      away: that logs out every other device.
    </EmailText>
  </EmailLayout>
)

export default AuthAlertEmail
