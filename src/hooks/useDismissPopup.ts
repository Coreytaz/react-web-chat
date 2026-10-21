import { useEffect, type RefObject } from 'react'

export function useDismissPopup(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void
) {
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (ref.current && !event.composedPath().includes(ref.current)) close()
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      ref.current?.querySelector<HTMLButtonElement>('button[aria-expanded]')?.focus()
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [ref, open, close])
}
