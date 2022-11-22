/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { UserBlock } from '..'
import styles from './ChatContainer.module.scss'
import { ReactComponent as Trash } from './Trash.svg'
import Point from '../../assets/point.svg'
import { useTypedSelector } from '../../hooks/useTypedSelector'
import { useAction } from '../../hooks/useAction'

const MessageHeader: React.FC = () => {
  const { selectedUser } = useTypedSelector((state) => state.selectedUserSlice)
  const { onClickClearAllMessages } = useAction()

  return (
    <div className={styles.mesage_header}>
              <div className={styles.message_user}>
              <UserBlock {...selectedUser} />
              </div>
              <div className={styles.message_dropdown}>
                  <img src={Point} className={styles.dropBtn}/>
                     <div className={styles.message_dropdown_content}>
                       <span onClick={() => onClickClearAllMessages()}>Удалить все сообщения <Trash/></span>
                       <span>Link 2</span>
                       <span>Link 3</span>
                </div>
              </div>
    </div>
  )
}

export default MessageHeader
