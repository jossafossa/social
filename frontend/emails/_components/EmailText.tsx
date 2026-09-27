import type { ReactNode } from 'react'
import { Text } from 'react-email'
import { colors, fonts } from './theme'

type EmailTextProps = {
  children: ReactNode
  tone?: 'default' | 'muted'
}

export const EmailText = ({ children, tone = 'default' }: EmailTextProps) => (
  <Text
    style={{
      margin: '0 0 16px',
      fontFamily: fonts.body,
      fontSize: tone === 'muted' ? '12px' : '14px',
      lineHeight: '1.6',
      color: tone === 'muted' ? colors.muted : colors.ink,
    }}
  >
    {children}
  </Text>
)
