/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-self-compare */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react'
import styles from './ChatContainer.module.scss'
import cn from 'classnames'
import { ReactComponent as Pencel } from './Pencel.svg'
import { ReactComponent as Trash } from './Trash.svg'
import { ReactComponent as Arrow } from '../../assets/arrow.svg'
import { attachment, MessageUpdatePayload } from '../../types/Chat.interface'
import { useAction } from '../../hooks/useAction'
import { formatTime } from '../../utils/formatTime'
import AudioMessage from './AudioMessage'
import { Modal } from '..'

interface MessageProps {
  id: string
  scrollRef: React.MutableRefObject<HTMLDivElement>
  fromSelf: boolean
  message: string
  createdAt: Date
  updatedAt: Date
  voiceMessage?: string
  setEditingState: React.Dispatch<React.SetStateAction<boolean>>
  setEditingMessage: React.Dispatch<React.SetStateAction<MessageUpdatePayload>>
  editingState: boolean
  attachments?: attachment[]
}

const Message: React.FC<MessageProps> = ({ id, scrollRef, fromSelf, message, setEditingState, editingState, setEditingMessage, createdAt, updatedAt, voiceMessage, attachments }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const { onRemoveMes } = useAction()
  const canEdit = new Date(new Date(createdAt).valueOf() + 24 * 60 * 60 * 1000) > new Date()
  if (voiceMessage !== null) {
    return <AudioMessage audioSrc={voiceMessage!} fromSelf={fromSelf} editingState={editingState} id={id} createdAt={createdAt}/>
  }
  const handlePreview = (url: string): void => {
    setPreviewImage(url)
    setPreviewOpen(true)
  }
  return (
    <>
    <div ref={scrollRef} className={cn(styles.row, styles.no_gutters)}>
        {!editingState && canEdit && fromSelf && <Pencel className={styles.toggleSvg} onClick={() => {
          setEditingState(true)
          setEditingMessage({ id, message, attachments })
        }} />}
        {!editingState && fromSelf && <Trash className={styles.toggleSvg} onClick={() => onRemoveMes(id)} />}
        <div className={cn(styles.chat_bubble,
          {
            [styles.chat_bubble__left]: !fromSelf,
            [styles.chat_bubble__right]: fromSelf
          })}>
            {message.length > 0 ? message : null}
            {attachments?.length! > 0
              ? <div className={styles.files}>
              {attachments?.map((file) => (
              <div className={styles.file} key={file.id}>
               <img src={file.url} alt={file.name} onClick={() => handlePreview(file.url)} />
             </div>
              ))}</div>
              : null}
          <div className={cn(styles.edit, {
            [styles.edit__left]: !fromSelf,
            [styles.edit__right]: fromSelf
          })}>{formatTime(createdAt) !== formatTime(updatedAt) ? '(ред).' : null}</div>
          <div className={cn(styles.time)}>{formatTime(createdAt)}</div>
          </div>
    </div>
    <Modal open={previewOpen} onClose={() => setPreviewOpen(!previewOpen)}>
      {attachments?.length! > 0 && <div className={styles.arrow_wrap}><Arrow className={cn(styles.arrow, styles.arrow_left)}/></div>}
        <img src={previewImage} alt="Image" />
      {attachments?.length! > 0 && <div className={styles.arrow_wrap}><Arrow className={cn(styles.arrow, styles.arrow_right)}/></div>}
    </Modal>
</>
  )
}

export default Message
