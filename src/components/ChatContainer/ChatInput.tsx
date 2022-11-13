/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EmojiClickData } from 'emoji-picker-react'
import React from 'react'
import { Button, Input } from '..'
import styles from './ChatContainer.module.scss'
import { ReactComponent as Emoji } from '../../assets/emoji.svg'
import ChatEmoji from './ChatEmoji'

interface ChatInputProps {
  onClickSendMessage: (msg: string) => void
}

type PopupClick = MouseEvent & {
  path: Node[]
}

const ChatInput: React.FC<ChatInputProps> = ({ onClickSendMessage }): JSX.Element => {
  const [input, setInput] = React.useState('')
  const emojiRef = React.useRef(null!)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)

  const onClick = (emojiData: EmojiClickData, event: MouseEvent): void => {
    let message = input
    message += emojiData.emoji
    setInput(message)
  }

  const onSendMesg = (): void => {
    onClickSendMessage(input)
    setInput('')
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
              autoComplete='off'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              name="message"
              placeholder="Напишите сообщение..."
              required
            />
            <Button appearance="primary" onClick={onSendMesg}>Отправить</Button>
    </div>
  )
}

export default ChatInput
