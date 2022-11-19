/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EmojiClickData } from 'emoji-picker-react'
import React from 'react'
import { Button, Input } from '..'
import styles from './ChatContainer.module.scss'
import { ReactComponent as Emoji } from '../../assets/emoji.svg'
import ChatEmoji from './ChatEmoji'
import { MessageUpdatePayload } from '../../types/Chat.interface'

interface ChatInputProps {
  editingState: boolean
  onUpdateMessage: (payload: MessageUpdatePayload) => void
  onClickSendMessage: (msg: string) => void
  editingMessage: MessageUpdatePayload
}

type PopupClick = MouseEvent & {
  path: Node[]
}

const ChatInput: React.FC<ChatInputProps> = ({ onClickSendMessage, onUpdateMessage, editingState, editingMessage }): JSX.Element => {
  const str = React.useRef<HTMLInputElement>(null!)
  const emojiRef = React.useRef(null!)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)

  const onClick = (emojiData: EmojiClickData, event: MouseEvent): void => {
    let message = str.current.value
    message += emojiData.emoji
    str.current.value = message
  }

  React.useEffect(() => {
    if (editingState) {
      str.current.value = editingMessage?.message
    }
  }, [editingMessage?.message, editingState])

  const onSendMesg = (): void => {
    if (editingState && str.current != null && str.current.value.length > 0) {
      editingMessage.message = str.current.value
      onUpdateMessage(editingMessage)
      str.current.value = ''
    } else if (str.current != null && str.current.value.length > 0) {
      onClickSendMessage(str.current?.value)
      str.current.value = ''
    }
  }

  React.useEffect(() => {
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
            <div className={styles.messges_emoji}>
            <Emoji onMouseEnter={() => setShowEmojiPicker(true)}/>
            {showEmojiPicker && <ChatEmoji ref={emojiRef} onClick={onClick}/>}
            </div>
            <Input
              ref={str}
              autoComplete='off'
              name="message"
              placeholder="Напишите сообщение..."
              required
            />
            <Button appearance="primary" onClick={onSendMesg}>Отправить</Button>
    </div>
  )
}

export default ChatInput
