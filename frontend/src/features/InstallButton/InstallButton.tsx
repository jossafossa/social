import { Button, Text } from '~/components'
import { useInstallPrompt } from '~/hooks'

// Nothing when there is nothing to offer (already installed, or a browser that can't install).
export const InstallButton = () => {
  const { status, install } = useInstallPrompt()

  if (status === 'installable') {
    return (
      <Button size="small" variant="dashed" onClick={install}>
        ↓ install app
      </Button>
    )
  }
  if (status === 'manual') {
    return (
      <Text size="small" tone="muted">
        install: Share → Add to Home Screen
      </Text>
    )
  }
  return undefined
}
