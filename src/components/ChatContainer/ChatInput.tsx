import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import React from 'react'
import { Button, Input } from '..'
import styles from './ChatContainer.module.scss'
import { ReactComponent as Emoji } from '../../assets/emoji.svg'

interface ChatInputProps {
  input: string
  setInput: (value: React.SetStateAction<string>) => void
  onClickSendMessage: () => void
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onClickSendMessage }) => {
  const onClick = (emojiData: EmojiClickData, event: MouseEvent): void => {
    let message = input
    message += emojiData.emoji
    setInput(message)
  }
  return (
    <div className={styles.messges_input}>
            <div className={styles.messges_emoji}>
            <Emoji/>
            <EmojiPicker
            onEmojiClick={onClick}
            autoFocusSearch={false}
            height={350}
            searchDisabled
            lazyLoadEmojis={true}
            skinTonesDisabled
             />
            </div>
            <Input
              autoComplete='false'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              name="message"
              placeholder="Напишите сообщение..."
              required
            />
            <Button appearance="primary" onClick={() => onClickSendMessage()}>Отправить</Button>
    </div>
  )
}

export default ChatInput
