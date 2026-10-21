import { useEffect, useRef } from 'react'
export function useDialogFocus(open: boolean, onClose: () => void) {
  const close = useRef(onClose)
  const dialog = useRef<HTMLDivElement>(null)
  useEffect(() => {
    close.current = onClose
  }, [onClose])
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    dialog.current?.focus()
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close.current()
      if (e.key === 'Tab') {
        const controls = dialog.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex="0"]'
        )
        const first = controls?.[0],
          last = controls?.[controls.length - 1]
        if (!first) {
          e.preventDefault()
          dialog.current?.focus()
        } else if (
          e.shiftKey &&
          (document.activeElement === first || document.activeElement === dialog.current)
        ) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('keydown', key)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [open])

  return dialog
}
