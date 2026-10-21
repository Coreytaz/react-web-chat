import { useRef, useState } from 'react'
import { useDismissPopup } from '../../hooks/useDismissPopup'
import DragDropMessage from '../DragDropFile/DragDropMessage'
import Input from '../UI/Input/Input'
import styles from './ChatContainer.module.scss'
import Emoji from '../../assets/emoji.svg?react'
import Close from '../../assets/close.svg?react'
import Audio from '../../assets/audio.svg?react'
import Send from '../../assets/send.svg?react'
import Trash from './Trash.svg?react'
import ChatEmoji from './ChatEmoji'
import { useChatComposer, type ChatComposerOptions } from '../../hooks/chat/useChatComposer'
export default function ChatInput({ to, editing, onCancel }: ChatComposerOptions) {
  const { input, setInput, attachments, setAttachments, recorder, pending, submit } =
    useChatComposer({ to, editing, onCancel })
  const [emoji, setEmoji] = useState(false)
  const emojiRef = useRef<HTMLDivElement>(null)
  useDismissPopup(emojiRef, emoji, () => setEmoji(false))
  return (
    <DragDropMessage
      attachments={attachments}
      setAttachments={setAttachments}
      disabled={recorder.isRecording || recorder.isBusy}
      savedIds={editing?.attachments?.map((file) => file.id) ?? []}
    >
      {editing ? (
        <span className={styles.mesg_editing}>
          Редактирование сообщения {editing.message}
          <Close role="button" aria-label="Отменить редактирование" onClick={onCancel} />
        </span>
      ) : null}
      <form
        className={styles.messges_input}
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        {!recorder.isRecording ? (
          <>
            <div className={styles.messges_emoji} ref={emojiRef}>
              <button
                type="button"
                className={styles.emoji_trigger}
                aria-label="Эмодзи"
                aria-expanded={emoji}
                aria-controls="emoji-popup"
                onClick={() => setEmoji(!emoji)}
              >
                <Emoji />
              </button>
              {emoji ? (
                <div id="emoji-popup" className={styles.emoji_panel}>
                  <ChatEmoji onClick={(data) => setInput((old) => old + data.emoji)} />
                </div>
              ) : null}
            </div>
            <Input
              aria-label="Сообщение"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите сообщение"
              disabled={recorder.isBusy}
            />
          </>
        ) : (
          <span>
            Идёт запись…{' '}
            <button type="button" aria-label="Отменить запись" onClick={recorder.cancel}>
              <Trash />
            </button>
          </span>
        )}
        {recorder.isBusy ? <span role="status">Обработка аудио…</span> : null}
        {!editing && !recorder.isRecording && !recorder.isBusy ? (
          <button
            type="button"
            aria-label="Записать голосовое сообщение"
            onClick={() => void recorder.start()}
          >
            <Audio />
          </button>
        ) : null}
        <button
          type="submit"
          aria-label={recorder.isRecording ? 'Отправить запись' : 'Отправить сообщение'}
          disabled={
            recorder.isBusy ||
            pending ||
            (!recorder.isRecording && !input.trim() && !attachments.length)
          }
        >
          <Send />
        </button>
      </form>
    </DragDropMessage>
  )
}
