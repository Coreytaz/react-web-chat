/* eslint-disable react/display-name */
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import React, { ForwardedRef } from 'react'

interface ChatEmojiProps {
  onClick: (emojiData: EmojiClickData, event: MouseEvent) => void
}

const ChatEmoji = React.forwardRef(({ onClick, ...props }: ChatEmojiProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
  return (
    <div ref={ref} {...props}>
    <EmojiPicker
            onEmojiClick={onClick}
            autoFocusSearch={false}
            height={350}
            searchDisabled
            lazyLoadEmojis={true}
            skinTonesDisabled
             />
    </div>
  )
})

export default ChatEmoji
