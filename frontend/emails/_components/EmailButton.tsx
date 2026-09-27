import { Button, Link, Section } from 'react-email'
import { EmailText } from './EmailText'
import { colors, fonts } from './theme'

type EmailButtonProps = {
  href: string
  label: string
}

// The site's accent button, plus the link written out for clients that block buttons.
export const EmailButton = ({ href, label }: EmailButtonProps) => (
  <>
    <Section style={{ margin: '8px 0 24px' }}>
      <Button
        href={href}
        style={{
          padding: '12px 18px',
          fontFamily: fonts.display,
          fontSize: '14px',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: colors.ink,
          backgroundColor: colors.accent,
          border: `2px solid ${colors.ink}`,
          boxShadow: `4px 4px 0 ${colors.ink}`,
        }}
      >
        {label} →
      </Button>
    </Section>
    <EmailText tone="muted">
      button not working? paste this into your browser:
      <br />
      <Link href={href} style={{ color: colors.ink, wordBreak: 'break-all' }}>
        {href}
      </Link>
    </EmailText>
  </>
)
