/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EmojiClickData } from 'emoji-picker-react'
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react'
import { Input } from '..'
import styles from './ChatContainer.module.scss'
import { ReactComponent as Emoji } from '../../assets/emoji.svg'
import { ReactComponent as Close } from '../../assets/close.svg'
import { ReactComponent as Audio } from '../../assets/audio.svg'
import { ReactComponent as Send } from '../../assets/send.svg'
import ChatEmoji from './ChatEmoji'
import { MessageUpdatePayload } from '../../types/Chat.interface'
import { useAction } from '../../hooks/useAction'

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
  const emojiRef = useRef(null!)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRendering, setIsRendering] = useState(false)
  const { onClickSendMessage, onUpdateMessage } = useAction()

  const onClick = (emojiData: EmojiClickData, event: MouseEvent): void => {
    let message = str.current.value
    message += emojiData.emoji
    str.current.value = message
  }

  useEffect(() => {
    if (isRendering) {
      setIsRendering(false)
    } else {
      if (editingState) {
        str.current.value = editingMessage?.message
      } else {
        str.current.value = ''
      }
    }
  }, [editingMessage?.message, editingState])

  const onSendMesg = (): void => {
    if (editingState && str.current != null && str.current.value.length > 0) {
      editingMessage.message = str.current.value
      onUpdateMessage(editingMessage)
      setEditingState(false)
      str.current.value = ''
    } else if (str.current != null && str.current.value.length > 0) {
      onClickSendMessage(str.current?.value)
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
    <div className={styles.messges_input}>
      {editingState && <span className={styles.mesg_editing}><span>Редактирование сообщения {editingMessage?.message}</span> <Close onClick={() => setEditingState(false)}/></span>}
            {!isRendering
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
            {!editingState && <Audio className={styles.messges_record} onClick={() => setIsRendering(true)}/>}
            </>
              : <><Close className={styles.messges_record_status_close} onClick={() => setIsRendering(false)}/>
              <div className={styles.messges_record_status}>
              <i className={styles.messges_record_status_bubble}></i>
              Recording...
            </div>
            </>}
            <Send className={styles.messges_send} onClick={onSendMesg}/>
    </div>
  )
}

export default ChatInput
