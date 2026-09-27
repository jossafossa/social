// `pnpm dev`: Vite, PocketBase, Mailpit and the email preview together. When the app or PocketBase
// stops (or you press Ctrl+C, or close the terminal) everything stops. Mailpit and the preview are
// optional: without them email just isn't caught or previewed. Saving an email in emails/ renders it
// into PocketBase (`pnpm emails`).
import { spawn, spawnSync } from 'node:child_process'
import { watch } from 'node:fs'
import { fileURLToPath } from 'node:url'

const backendDir = fileURLToPath(new URL('../../backend/', import.meta.url))
const appUrl = 'http://localhost:5173'
const emailsDir = fileURLToPath(new URL('../emails/', import.meta.url))
const mailpit = { smtpPort: '1025', inboxUrl: 'http://localhost:8025' }
const emailPreviewPort = '3030'

const log = (line) => process.stdout.write(`${line}\n`)

const children = []
const watchers = []
let isStopping = false

const stopAll = (exitCode) => {
  if (isStopping) {
    return
  }
  isStopping = true
  for (const watcher of watchers) {
    watcher.close()
  }
  for (const { child, isGroup } of children) {
    if (isGroup) {
      // Its own group: the servers it starts under it stop too.
      process.kill(-child.pid, 'SIGTERM')
    } else {
      child.kill('SIGTERM')
    }
  }
  process.exitCode = exitCode
}

// Vite keeps the terminal (its keyboard shortcuts need it); the others' output is prefixed.
const prefixLines = (name, stream) => {
  let pending = ''
  stream.on('data', (chunk) => {
    const lines = (pending + chunk).split('\n')
    pending = lines.pop() ?? ''
    for (const line of lines) {
      log(`[${name}] ${line}`)
    }
  })
}

// `whenStopped` marks an optional one: it may stop without taking the rest along. `isGroup` for
// one that starts servers of its own, which a signal to it alone would leave running. Not Vite: a
// process outside the terminal's group can't read the keyboard.
const start = ({ name, command, args, options = {}, whenStopped, isGroup = false }) => {
  const child = spawn(command, args, {
    stdio: name === 'vite' ? 'inherit' : ['ignore', 'pipe', 'pipe'],
    detached: isGroup,
    ...options,
  })
  if (child.stdout) {
    prefixLines(name, child.stdout)
    prefixLines(name, child.stderr)
  }
  child.on('exit', (code) => {
    if (isStopping) {
      return
    }
    if (whenStopped === undefined) {
      log(`[dev] ${name} stopped (exit ${code ?? 'signal'}): stopping the rest`)
      stopAll(code ?? 1)
    } else {
      log(`[dev] ${name} stopped (exit ${code ?? 'signal'}): ${whenStopped}`)
    }
  })
  children.push({ child, isGroup })
}

// One render at a time; saves during a render queue one more, as editors write several times.
let emailRender
let isEmailRenderQueued = false
const renderEmails = () => {
  if (emailRender) {
    isEmailRenderQueued = true
    return
  }
  emailRender = spawn('pnpm', ['run', '--silent', 'emails', '--silent'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  prefixLines('emails', emailRender.stdout)
  prefixLines('emails', emailRender.stderr)
  emailRender.on('exit', (code) => {
    emailRender = undefined
    log(
      code === 0
        ? '[emails] rendered into backend/pb_hooks/emails'
        : `[emails] render failed (exit ${code ?? 'signal'})`,
    )
    if (isEmailRenderQueued && !isStopping) {
      isEmailRenderQueued = false
      renderEmails()
    }
  })
}

let emailRenderTimer
const watchEmails = () => {
  const watcher = watch(emailsDir, { recursive: true }, () => {
    clearTimeout(emailRenderTimer)
    emailRenderTimer = setTimeout(renderEmails, 300)
  })
  watchers.push(watcher)
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.on(signal, () => stopAll(0))
}

const hasMailpit = spawnSync('mailpit', ['version'], { stdio: 'ignore' }).error === undefined
if (hasMailpit) {
  start({
    name: 'mailpit',
    command: 'mailpit',
    args: ['--smtp', `127.0.0.1:${mailpit.smtpPort}`, '--listen', '127.0.0.1:8025', '--quiet'],
    whenStopped: "email won't be caught",
  })
  log(`[dev] email inbox: ${mailpit.inboxUrl}`)
} else {
  log('[dev] mailpit not found (brew install mailpit): email is not caught')
}

start({
  name: 'pocketbase',
  command: './pocketbase',
  args: ['serve'],
  options: {
    cwd: backendDir,
    env: {
      ...process.env,
      ...(hasMailpit && { DEV_MAILPIT_SMTP_PORT: mailpit.smtpPort, DEV_APP_URL: appUrl }),
    },
  },
})

start({
  name: 'email-preview',
  command: 'email',
  args: ['dev', '--dir', 'emails', '--port', emailPreviewPort],
  whenStopped: 'no email preview',
  isGroup: true,
})
log(`[dev] email preview: http://localhost:${emailPreviewPort}`)
watchEmails()

// Strict port: email links point at appUrl, so Vite mustn't quietly move to another one.
start({ name: 'vite', command: 'vite', args: ['--port', '5173', '--strictPort'] })
