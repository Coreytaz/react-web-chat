/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import { ReactComponent as Trash } from './Trash.svg'
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
  const [input, setInput] = useState('')
  const [edit, setEdit] = useState(editingMessage?.message)
  const emojiRef = useRef(null!)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { onClickSendMessage, onUpdateMessage, onRemoveMes } = useAction()
  const [attachments, setAttachments] = useState<attachment[]>([])
  const { onRecord, mediaRecorder, isRecording, onHideRecording, setIsRecording } = useRecorder()

  const onClick = (emojiData: EmojiClickData, event: MouseEvent): void => {
    let message = input
    message += emojiData.emoji
    setInput(message)
  }

  useEffect(() => {
    if (isRecording) {
      setIsRecording(false)
      setEdit(editingMessage?.message)
    } else {
      if (editingState) {
        setInput(editingMessage?.message)
        setAttachments(editingMessage.attachments!)
      } else {
        setInput('')
        setAttachments([])
      }
    }
  }, [editingMessage?.message, editingState])

  useEffect(() => {
    if (edit) {
      setInput(edit)
    }
  }, [edit])

  const onSendMesg = (): void => {
    if (isRecording) {
      mediaRecorder.stop()
    } else if (editingState && (attachments.length > 0 || input.length > 0)) {
      if (editingMessage.message === input && editingMessage.attachments === attachments) {
        setEditingState(false)
        return
      }
      editingMessage.message = input
      editingMessage.attachments = attachments
      onUpdateMessage(editingMessage)
      setEditingState(false)
      setInput('')
    } else if (input.length > 0 || attachments.length > 0) {
      const item = { msg: input, attachments }
      onClickSendMessage(item)
      setAttachments([])
      setInput('')
    }
  }

  const onDeleteMsg = (id: string): void => {
    onRemoveMes(id)
    setEditingState(false)
    setAttachments([])
    setInput('')
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoComplete='off'
              name="message"
              placeholder="Напишите сообщение..."
              required
              onKeyDown={(e) => { e.code === 'Enter' ? editingState ? onDeleteMsg(editingMessage.id) : onSendMesg() : null }}
            />
            </>
              : <><Close className={styles.messges_record_status_close} onClick={() => onHideRecording()}/>
              <div className={styles.messges_record_status}>
              <i className={styles.messges_record_status_bubble}></i>
              <span>Recording...</span>
            </div>
            </>}
            {!(isRecording || (attachments.length > 0) || editingState || (input.length > 0)) ? <Audio className={styles.messges_record} onClick={() => onRecord()}/> : null}
            {(attachments.length > 0 || input.length > 0 || isRecording) ? <Send className={styles.messges_send} onClick={onSendMesg}/> : null}
            {editingState && attachments.length === 0 && input.length === 0
              ? <Trash className={styles.messges_del} onClick={() => onDeleteMsg(editingMessage.id)} />
              : null}
    </div>
    </DragDropMessage>
  )
}

export default ChatInput
