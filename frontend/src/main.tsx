import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { restoreSession } from '~/api'
import { App } from '~/App'
import '~/styles/global.scss'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('index.html is missing #root')
}

await restoreSession()

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
