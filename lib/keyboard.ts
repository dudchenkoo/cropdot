export type ShortcutConfig = {
  key: string
  metaOrCtrl?: boolean
  shift?: boolean
  alt?: boolean
  allowInInputs?: boolean
  preventDefault?: boolean
  handler: (event: KeyboardEvent) => void
}

function matchesShortcut(event: KeyboardEvent, shortcut: ShortcutConfig) {
  const key = event.key.toLowerCase()
  const shortcutKey = shortcut.key.toLowerCase()

  const modMatch = shortcut.metaOrCtrl ? event.metaKey || event.ctrlKey : true
  const shiftMatch = shortcut.shift ? event.shiftKey : !shortcut.shift || !event.shiftKey
  const altMatch = shortcut.alt ? event.altKey : !shortcut.alt || !event.altKey

  return key === shortcutKey && modMatch && shiftMatch && altMatch
}

export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tagName = target.tagName.toLowerCase()

  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  )
}

export function registerKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handler = (event: KeyboardEvent) => {
    shortcuts.forEach((shortcut) => {
      if (!shortcut.allowInInputs && isEditableTarget(event.target)) return

      if (matchesShortcut(event, shortcut)) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault()
        }
        shortcut.handler(event)
      }
    })
  }

  window.addEventListener("keydown", handler)
  return () => window.removeEventListener("keydown", handler)
}
