import type { ReactNode } from 'react'
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from 'react-email'
import { colors, fonts } from './theme'

type EmailLayoutProps = {
  title: string
  preview: string
  children: ReactNode
  footer: string
}

// Apple Mail and iOS load it; the rest fall back to their monospace (theme.ts).
const fontsUrl =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Space+Mono:wght@700&display=swap'

// The card from the sign-in pages: 2px ink border, hard offset shadow, no radius.
export const EmailLayout = ({ title, preview, children, footer }: EmailLayoutProps) => (
  <Html lang="en" style={{ backgroundColor: colors.paper }}>
    <Head>
      <link rel="stylesheet" href={fontsUrl} />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={{ margin: 0, padding: '32px 16px', backgroundColor: colors.paper }}>
      <Container style={{ maxWidth: '520px' }}>
        <Text
          style={{
            margin: '0 0 20px',
            fontFamily: fonts.display,
            fontSize: '20px',
            fontWeight: 700,
            color: colors.ink,
          }}
        >
          pb/social_
        </Text>
        <Section
          style={{
            padding: '28px',
            backgroundColor: colors.surface,
            border: `2px solid ${colors.ink}`,
            boxShadow: `6px 6px 0 ${colors.ink}`,
          }}
        >
          <Heading
            as="h1"
            style={{
              margin: '0 0 16px',
              fontFamily: fonts.display,
              fontSize: '26px',
              fontWeight: 700,
              lineHeight: '1.2',
              color: colors.ink,
            }}
          >
            $ {title}
          </Heading>
          {children}
        </Section>
        <Text
          style={{
            margin: '24px 0 0',
            fontFamily: fonts.body,
            fontSize: '12px',
            lineHeight: '1.6',
            color: colors.muted,
          }}
        >
          {footer}
        </Text>
      </Container>
    </Body>
  </Html>
)
