import { memo, useState } from 'react'
import cn from 'classnames'
import styles from './ChatContainer.module.scss'
import Pencil from './Pencel.svg?react'
import Trash from './Trash.svg?react'
import type { ChatMessage, MessageUpdatePayload } from '../../types/Chat.interface'
import socket from '../../service/chat/socket.service'
import { formatTime } from '../../utils/formatTime'
import AudioMessage from './AudioMessage'
import Modal from '../Modal/Modal'
function Message({
  id,
  fromSelf,
  message,
  createdAt,
  updatedAt,
  voiceMessage,
  attachments = [],
  editingState,
  onEdit
}: ChatMessage & { editingState: boolean; onEdit: (data: MessageUpdatePayload) => void }) {
  const [preview, setPreview] = useState('')
  const canEdit = Date.parse(createdAt) + 86400000 > Date.now()
  if (voiceMessage)
    return (
      <AudioMessage
        audioSrc={voiceMessage}
        fromSelf={fromSelf}
        editingState={editingState}
        id={id}
        createdAt={createdAt}
      />
    )
  return (
    <>
      <div className={cn(styles.row, styles.no_gutters)}>
        {!editingState && canEdit && fromSelf ? (
          <Pencil
            role="button"
            aria-label="Редактировать сообщение"
            className={styles.toggleSvg}
            onClick={() => onEdit({ id, message: message ?? '', attachments })}
          />
        ) : null}
        {!editingState && fromSelf ? (
          <Trash
            role="button"
            aria-label="Удалить сообщение"
            className={styles.toggleSvg}
            onClick={() => socket.emit('message:delete', id)}
          />
        ) : null}
        <div
          className={cn(styles.chat_bubble, {
            [styles.chat_bubble__left]: !fromSelf,
            [styles.chat_bubble__right]: fromSelf
          })}
        >
          {message}
          {attachments.length ? (
            <div className={styles.files}>
              {attachments.map((file) => (
                <div className={styles.file} key={file.id}>
                  <img src={file.url} alt={file.name} onClick={() => setPreview(file.url)} />
                </div>
              ))}
            </div>
          ) : null}
          <div
            className={cn(styles.edit, {
              [styles.edit__left]: !fromSelf,
              [styles.edit__right]: fromSelf
            })}
          >
            {createdAt !== updatedAt ? '(ред.)' : null}
          </div>
          <div className={styles.time}>{formatTime(createdAt)}</div>
        </div>
      </div>
      <Modal open={!!preview} onClose={() => setPreview('')}>
        <img src={preview} alt="Вложение" />
      </Modal>
    </>
  )
}

export default memo(Message)
