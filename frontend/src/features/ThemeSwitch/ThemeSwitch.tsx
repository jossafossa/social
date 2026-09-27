import { SegmentedControl } from '~/components'
import { themes, useTheme } from '~/hooks'

type ThemeSwitchProps = {
  layout?: 'inline' | 'stacked'
}

export const ThemeSwitch = ({ layout }: ThemeSwitchProps) => {
  const { theme, setTheme } = useTheme()
  return (
    <SegmentedControl
      legend="theme"
      options={themes}
      value={theme}
      onChange={setTheme}
      layout={layout}
    />
  )
}
