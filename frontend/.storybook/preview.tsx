import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import '../src/styles/global.scss'

// Cards and headers render router links; a memory router lets them draw without the app's.
const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
  },
}

export default preview
