# Coding Style Guide

Portable, self-contained coding standard for TypeScript + React projects. Copy this file into any project's `.claude/` folder. It is the source of truth for style; any agent or teammate should follow it without needing external context.

Formatting (indentation, quotes, semicolons, line length, import order) is **not** covered here — it is delegated to **Prettier + ESLint**. If a rule below conflicts with a project's linter config, the linter wins for mechanical formatting; this doc wins for everything else.

---

## 1. Principles

The lens. Use these when no specific rule below applies.

1. **Single purpose per unit.** Every function, component, hook, and file has one reason to change. Smell test: can you name it without "and"?
2. **Make illegal states unrepresentable.** Prefer discriminated unions over flat objects with many optional fields.
3. **Keep state minimal.** Derive what you can. If two state values always change together, one is redundant.
4. **Co-locate what changes together, separate what doesn't.** Tests, styles, and stories live beside their component; pure logic stays out of rendering.
5. **Fail loud on invariant violations.** Throw early (e.g. a context hook used outside its provider) rather than returning a nullable the caller must defend against.
6. **Rule of three.** Don't abstract until three concrete examples exist. Two similar blocks are fine.

---

## 2. Naming & Readability

- No abbreviations in names. `user` not `usr`, `buttonElement` not `btnEl`. Short loop counters (`i`, `j`) are fine.
- Booleans are always prefixed: `isOpen`, `hasError`, `shouldRender`, `canSubmit`. Never bare `open` / `error` / `loading` for a boolean.
- Event handlers: `handleX` for internal functions, `onX` for prop names.

```tsx
// good
<Button onClick={handleSubmit} />
const handleSubmit = () => { ... }

// bad
<Button onClick={submit} />
```

- Destructure props and objects early so the function body stays flat.

---

## 3. Functions

- Always `const` + arrow functions. Never `function` declarations — this includes components and hooks.

```ts
// good
const useCounter = () => { ... }
const Button = () => { ... }

// bad
function Button() { ... }
```

- Pure helpers and constants that don't depend on props/state live at module scope, not redefined inside the component body on every render.

---

## 4. Control Flow

- No nested ternaries. One level is fine; a second level becomes an `if`/`else` or an early return.
- Prefer early returns and guard clauses over deep nesting.

```ts
// good
if (!user) return null
return <Profile user={user} />

// bad
return user ? <Profile user={user} /> : null // ok once, but not stacked
```

- Use `??` for defaults, not `||`. `||` falls through on any falsy value (`0`, `''`, `false`) and hides bugs.

```ts
const count = room?.events.length ?? 0 // good
const count = room?.events.length || 0 // bad — masks a real 0
```

---

## 5. Types

- Default to `undefined` for "absent", not `null`. Use `null` only when an external API demands it.
- Union types over TS `enum` — enums have awkward runtime semantics and hurt tree-shaking.

```ts
// good
type Size = 'sm' | 'md' | 'lg'

// bad
enum Size {
  Small,
  Medium,
  Large,
}
```

- Literal unions over multiple related booleans.

```ts
// good
variant: 'primary' | 'secondary'

// bad
isPrimary: boolean
isSecondary: boolean
```

- Never `any`. Type it properly, or use `unknown` and narrow. `any` silently disables checking for everything it touches.

```ts
// good
const getSchema = (t: TFunction) => ...

// bad
const getSchema = (t: any) => ...
```

- Type external data at the boundary. Give fetch/JSON responses a declared type where they enter so untyped data can't spread inward. A cast (`as`) only _asserts_ a shape — it doesn't check it; for untrusted input, validate at runtime (e.g. a schema) instead.

- Type-only imports use `import type` (or inline `type` markers). Keeps type imports out of the runtime bundle and makes intent explicit.

```ts
import type { AppDispatch } from './store'
import { useSyncQuery, type TimelineEvent } from './matrixApi'
```

---

## 6. Exports

- Named exports, never default exports.
- Where a framework requires a default export (Storybook stories, config files), scope the exception to that file only.

---

## 7. Props

- Required props first, optional props last — in both the type definition and the call site.

```ts
type ButtonProps = {
  label: string // required first
  onClick: () => void
  variant?: 'primary' | 'secondary' // optional last
}
```

---

## 8. React

### Component structure

- Order inside a component: hooks → derived values → handlers → early returns → JSX.
- Keep components small. If the JSX has multiple distinct regions with their own logic, split them.
- One component per file, file name matching the component. See §11 for folder layout.

### Hooks

- Custom hooks are `const` arrow functions prefixed `use` (`useCounter`).
- Obey the rules of hooks: call unconditionally, top level only.
- Extract a custom hook when stateful logic is reused or when a component's hook section grows past its rendering concern.

### Props typing

- Type props with a local `type` (not `interface`) named `<Component>Props`.
- No `React.FC`. Type the props argument directly.

```tsx
// good
type ButtonProps = { label: string }
const Button = ({ label }: ButtonProps) => <button>{label}</button>

// bad
const Button: React.FC<ButtonProps> = ({ label }) => ...
```

### State & derivation

- Derive during render; don't mirror props/state into more state.
- `useState` / `useReducer` for local state. Lift state only when it is genuinely shared.
- Reach for Context only at a real cross-tree need. An external state library is justified only when Context becomes a bottleneck — pick one per project, don't mandate it here.

```tsx
// good — derived, not stored
const fullName = `${firstName} ${lastName}`

// bad — redundant state that can desync
const [fullName, setFullName] = useState('')
useEffect(() => setFullName(`${firstName} ${lastName}`), [firstName, lastName])
```

### Effects discipline

- `useEffect` is for synchronizing with something outside React (DOM, network, subscriptions, timers).
- Not for computing derived data (derive in render) and not for reacting to a user event (do it in the handler).
- Every effect has a correct dependency array and a cleanup where it subscribes.

---

## 9. Styling

- CSS Modules or SCSS Modules, colocated with the component: `Button/Button.module.scss`.
- Scoped by default; no global styles except a single deliberate reset/tokens layer.
- No runtime CSS-in-JS.

```tsx
import styles from './Button.module.scss'
const Button = () => <button className={styles.button} />
```

---

## 10. Testing

- Vitest as the runner (or Jest where the project already uses it).
- React Testing Library for components.
- Test files colocated: `Button.test.tsx` beside `Button.tsx`.
- Test behavior and public contract, not implementation details. Query by role/text, not by class or internal state.

```tsx
// good — behavior
await user.click(screen.getByRole('button', { name: 'Save' }))
expect(screen.getByText('Saved')).toBeInTheDocument()

// bad — implementation
expect(wrapper.state('isSaved')).toBe(true)
```

---

## 11. Files & Folders

- Folder per component. Everything the component owns lives together:

```
Button/
  Button.tsx
  Button.module.scss
  Button.test.tsx
  index.ts          // optional barrel: export { Button } from './Button'
```

- Casing:
  - Components and their files: `PascalCase` (`Button.tsx`).
  - Hooks and utilities: `camelCase` (`useCounter.ts`, `formatDate.ts`).
- One component per file. Small private sub-components may share the file if they are never used elsewhere.
- Import via a path alias (`~/…`) and folder barrels, not deep relative chains. `import { Button } from '~/components'` over `import Button from '../../../components/Button/Button'`. Reserve relative imports for siblings within the same feature folder.

---

## 12. Comments

- Only for genuine exceptions.
- Never explain _what_ the code does — explain the non-obvious _why_: workarounds, hidden constraints, subtle invariants.

```ts
// good
// Safari fires resize before layout settles; defer a frame to read correct height.
requestAnimationFrame(measure)

// bad
// set loading to true
setIsLoading(true)
```

- Narrow exception: in a large flag/config type or object, short section headers that group related members are fine — they aid scanning, not explanation.

```ts
type Settings = {
  // Copy features
  copyPrNumbers: boolean
  copyCommitHashes: boolean

  // UI tweaks
  greyOutDrafts: boolean
}
```

---
## 13. Project addendum (pocketbase-demo)

Sections 1–12 are the portable guide, copied verbatim — leave them alone. Everything specific to
this repo lives here.

### Layers (`frontend/src`)

| Folder       | Holds                                                         | May import                                   |
| ------------ | ------------------------------------------------------------- | -------------------------------------------- |
| `utils`      | pure helpers                                                  | its own siblings                             |
| `api`        | PocketBase client, RTK Query `api`, store, record types       | `~/utils`                                    |
| `hooks`      | app hooks (current user, logout)                              | `~/api`, `~/utils`                           |
| `components` | reusable UI (Button, TextField, UserCard, List…) — no API calls | `~/api` types + `getFileUrl`, `~/utils`, `~/paths` |
| `features`   | connected UI: components wired to mutations and the user      | `~/api`, `~/components`, `~/hooks`, `~/utils` |
| `pages`      | routes and layouts: read queries, compose the rest            | everything below                             |

### Data

- PocketBase is reached only through `~/api`. Components never call `pb` directly.
- Server state lives in RTK Query. Endpoints use `fakeBaseQuery` + `queryFn` around the SDK;
  errors are strings. No realtime subscriptions: mutations invalidate tags and lists refetch —
  except likes, comments and post edits, which patch the cached post (`patchCachedPost`).
- Keep server load down: page every list, pass `fields` for other users' records, never expand a
  back-relation just to count it (add a counter in `pb_hooks` instead).
- Visitors browse read-only (PocketBase list/view rules are public; writes need an account). Read
  the user with `useCurrentUser` and handle `undefined`; `useAuthenticatedUser` only behind
  `MembersOnly` or a user check. A visitor follows people and groups in their browser
  (`useGuestFollows`) instead of friending or joining, and sees no like, reply or post controls.
- Auth state is PocketBase's `authStore` (localStorage), read via `useCurrentUser`. Local UI state
  stays in `useState`.

### Styling (extends §9)

- Look: "Terminal zine" (design canvas). Monospace body (IBM Plex Mono), Space Mono display,
  paper/ink palette, one accent, 2px borders, hard offset shadows, no radius.
- The one global sheet is `src/styles/global.scss`: design tokens as CSS custom properties
  (`--color-*`, `--border`, `--shadow`, `--font-*`) plus page defaults. Components use the tokens,
  never raw hex values. `src/styles/field.module.scss` is the shared field look.
- Text goes through `Text` (`p`/`span`, `size`, `tone`), headings through `Heading` (`level={1}`
  page title, `level={2}` "// SECTION" label); both have no margin. Never a raw `<p>`, `<span>` or `<h1>`.
- Spacing comes only from `Stack` (`gap`, `direction`, `align`, `justify`, `as`, `className`). No
  margins between elements and no one-off flex CSS for spacing. Column stacks stretch children;
  inline controls sit in a `direction="row"` stack. `Card` and `Form` wrap a `Stack`.
- Merge an optional `className` last with `classnames`.
- Names (users, groups) never wrap: cut them off with `~/styles/truncate.module.scss` and put
  the full name in `title`. Headings take `title` for this. A flex row holding a name needs
  `isWrapping={false}` (or `flex-wrap: nowrap`), or it wraps before the name shrinks.

### Components & Storybook

- `src/components` is presentational only: props in, callbacks out. No queries, mutations, stores
  or hooks from `~/api`/`~/hooks` — pure helpers like `getFileUrl` and router links are fine.
  Anything that fetches or mutates lives in `src/features`.
- Every component has a `.stories.tsx` beside it: `satisfies Meta<typeof Component>`,
  `tags: ['autodocs']`, handlers from `fn()` (`storybook/test`), `title: 'Components/<Name>'`.
  Story data comes from `src/components/fixtures.ts`.

### Forms, errors & shortcuts

- Every form uses react-hook-form with a zod schema (`zodResolver`). Shared rules live in
  `~/utils/validation.ts`; a form composes its own schema from them. File inputs register as a
  `FileList` and the schema transforms it to one `File`. Field errors go in the field's `error` prop.
- Use `useWatch`, never `watch()` (the React Compiler can't memoize `watch`). Focus a field that
  opens on click with `setFocus` in an effect, never `autoFocus`.
- Posts, comments and bios are markdown. Edit them with `MarkdownEditor` (through a `Controller`),
  show them with `Markdown` — never `TextArea` or `Text`. Both support the same small set (bold,
  italic, underline as `++text++`, strike, inline code, lists, quotes); `Markdown` shows anything
  else as plain text.
- API errors from mutations surface as toasts through the store middleware — forms don't render
  them. Failed queries render inline with `QueryStatus`.
- Keyboard: `[`/`]` switch section, `/` global search, `n` new post, `?` help; inside a form ⌘↵
  (macOS) / Ctrl+Enter (Windows, Linux) submits and Esc presses its `data-cancel` control. Key
  labels come from `submitShortcut`/`cancelShortcut` in `~/utils`, never hard-coded. A control that
  has a shortcut shows it with `Kbd`; buttons take `shortcut={keys}` and show it as a badge on
  their top-right corner, so it never widens the button. Claim a key with `data-shortcut="<key>"`.
- Feeds: posts are `[data-post]` (tabIndex -1); `j`/`k` move between them and a post's buttons
  claim `l`/`c`/`r`/`e` via `data-post-action`, their hints shown only while the post has focus
  (`isPostShortcut`). Lists of destinations (sidebar menu, card grids) keep every item a Tab stop;
  arrow keys move between them on top of that (`useArrowNavigation`, items marked
  `data-arrow-item`). Only a real composite control (tabs, toolbar) may be a single Tab stop.
  Lists take `loadMore` so focus lands on the first new item; full-page lists (post feeds,
  friends, groups) also set `isAutomatic` to load on scroll. Comments and search, which stacks two
  lists, keep the button. Navigation focuses the page's search
  box, else its `h1` (`usePageFocus`); a shortcut that places focus itself navigates with
  `keepFocusState`.
- Never `disabled` a button while a request runs: it drops keyboard focus. Use `isBusy`. When
  something a control opened closes again, return focus to that control (`useFocusReturn`).
- Breadcrumbs are declared per route in `handle.crumbs` (`router.tsx`) and rendered by
  `AppBreadcrumbs` in the sticky top bar. Focus styling is global (`--focus-outline`) and shows for
  keyboard users only (`data-input-modality`, from `useInputModality`). Components don't set their
  own outlines, except a wrapper that draws the ring for a hidden or borderless control inside it:
  gate that on `:global(:root[data-input-modality='keyboard'])` and switch the inner one off.

### Memoization

The React Compiler is on. Never write `useMemo`, `useCallback` or `memo()`.

### Enforced by the linter

`.oxlintrc.json`: `func-style: expression`, `arrow-body-style`, `curly: all`, `eqeqeq`,
`prefer-const`, `no-nested-ternary`, `import/no-default-export` (except `vite.config.ts`),
`typescript/no-explicit-any`, `typescript/consistent-type-imports`, `react/no-array-index-key`.
