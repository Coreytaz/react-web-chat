/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EmojiClickData } from 'emoji-picker-react'
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { DragDropMessage, Input } from '..'
import styles from './ChatContainer.module.scss'
import { ReactComponent as Emoji } from '../../assets/emoji.svg'
import { ReactComponent as Close } from '../../assets/close.svg'
import { ReactComponent as Audio } from '../../assets/audio.svg'
import { ReactComponent as Send } from '../../assets/send.svg'
import ChatEmoji from './ChatEmoji'
import { attachment, MessageUpdatePayload } from '../../types/Chat.interface'
import { useAction } from '../../hooks/useAction'
import { useRecorder } from '../../hooks/useRecorder'

interface ChatInputProps {
  editingState: boolean
  editingMessage: MessageUpdatePayload
  setEditingState: Dispatch<SetStateAction<boolean>>
}

type PopupClick = MouseEvent & {
  path: Node[]
}

const ChatInput: FC<ChatInputProps> = ({ editingState, editingMessage, setEditingState }): JSX.Element => {
  const str = useRef<HTMLInputElement>(null!)
  const [edit, setEdit] = useState(editingMessage?.message)
  const emojiRef = useRef(null!)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { onClickSendMessage, onUpdateMessage } = useAction()
  const [attachments, setAttachments] = useState<attachment[]>([])
  const { onRecord, mediaRecorder, isRecording, onHideRecording, setIsRecording } = useRecorder()

  const onClick = (emojiData: EmojiClickData, event: MouseEvent): void => {
    let message = str.current.value
    message += emojiData.emoji
    str.current.value = message
  }

  useEffect(() => {
    if (isRecording) {
      setIsRecording(false)
      setEdit(editingMessage?.message)
    } else {
      if (editingState) {
        str.current.value = editingMessage?.message
        setAttachments(editingMessage.attachments!)
      } else {
        str.current.value = ''
        setAttachments([])
      }
    }
  }, [editingMessage?.message, editingState])

  useEffect(() => {
    if (edit) {
      str.current.value = edit
    }
  }, [edit])

  const onSendMesg = (): void => {
    console.log(editingState)
    if (isRecording) {
      mediaRecorder.stop()
    } else if (editingState && (attachments.length > 0 || (str.current != null && str.current.value.length > 0))) {
      editingMessage.message = str.current.value
      editingMessage.attachments = attachments
      onUpdateMessage(editingMessage)
      setEditingState(false)
      str.current.value = ''
    } else if ((str.current != null && str.current.value.length > 0) || (attachments.length > 0)) {
      const item = { msg: str.current.value, attachments }
      onClickSendMessage(item)
      setAttachments([])
      str.current.value = ''
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const _event = event as PopupClick
      if ((emojiRef.current != null) && !_event.path.includes(emojiRef.current)) {
        setShowEmojiPicker(false)
      }
    }

    document.body.addEventListener('mouseover', handleClickOutside)

    return () => {
      document.body.removeEventListener('mouseover', handleClickOutside)
    }
  }, [])

  return (
    <DragDropMessage attachments={attachments} setAttachments={setAttachments} disabled={isRecording}>
      {editingState &&
      <span className={styles.mesg_editing}>
        <span>Редактирование сообщения {editingMessage?.message}
        </span> <Close onClick={() => setEditingState(false)}/>
      </span>}
    <div className={styles.messges_input}>
            {!isRecording
              ? <><div className={styles.messges_emoji}>
            <Emoji onMouseEnter={() => setShowEmojiPicker(true)}/>
            {showEmojiPicker && <ChatEmoji ref={emojiRef} onClick={onClick}/>}
            </div>
            <Input
              ref={str}
              autoComplete='off'
              name="message"
              placeholder="Напишите сообщение..."
              required
              onKeyDown={(e) => { e.code === 'Enter' && onSendMesg() }}
            />
            {!(attachments.length > 0) && !editingState && <Audio className={styles.messges_record} onClick={() => onRecord()}/>}
            </>
              : <><Close className={styles.messges_record_status_close} onClick={() => onHideRecording()}/>
              <div className={styles.messges_record_status}>
              <i className={styles.messges_record_status_bubble}></i>
              <span>Recording...</span>
            </div>
            </>}
            <Send className={styles.messges_send} onClick={onSendMesg}/>
    </div>
    </DragDropMessage>
  )
}

export default ChatInput
