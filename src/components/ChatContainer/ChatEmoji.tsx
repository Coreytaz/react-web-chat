import { lazy, Suspense } from 'react'
import type { EmojiClickData } from 'emoji-picker-react'
import styles from './ChatContainer.module.scss'
const EmojiPicker = lazy(() => import('emoji-picker-react'))
interface ChatEmojiProps {
  onClick: (data: EmojiClickData, event: MouseEvent) => void
}
export default function ChatEmoji({ onClick }: ChatEmojiProps) {
  return (
    <Suspense fallback={<span role="status">Загрузка эмодзи…</span>}>
      <EmojiPicker
        className={styles.emoji_picker}
        onEmojiClick={onClick}
        autoFocusSearch={false}
        width="100%"
        height="min(350px, calc(100dvh - 100px))"
        searchDisabled
        lazyLoadEmojis
        skinTonesDisabled
        previewConfig={{ showPreview: false }}
      />
    </Suspense>
  )
}
