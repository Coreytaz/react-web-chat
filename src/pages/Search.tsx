/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, UserBlock, UserBlockReqSkeleton } from '../components'
import { useSearchUsers } from '../hooks/user/useSearchUsers'
import { useTypedSelector } from '../hooks/useTypedSelector'
import socket from '../service/chat/socket.service'
import styles from '../style/Page/Search.module.scss'

const Search: React.FC = () => {
  const navigate = useNavigate()
  const { refetch, isFetching, userList } = useSearchUsers()
  const { _id } = useTypedSelector((state) => state.authSlice.user)

  React.useEffect(() => {
    void refetch()
  }, [refetch])

  const onClickRequestToFriends = (e: React.MouseEvent<HTMLButtonElement>, id: string): void => {
    socket.emit('reguest:user', {
      sender: _id,
      taker: id
    })
    e.currentTarget.disabled = true
  }

  return (
    <div className={styles.friend__block}>
            <div className={styles.friend__header}>
                <span onClick={() => navigate(-1)}>Назад</span>
                <h3>Все пользователя {userList?.total}</h3>
            </div>
            <div className={styles.search__friends}>
                <Input name="Поиск" placeholder="Введите запрос" required />
            </div>
            <div className={styles.friends__list}>
            {isFetching
              ? [...new Array(5)].map((_, i) => <div className={styles.friends__user} key={i}>
              <UserBlockReqSkeleton/>
          </div>)
              : userList?.items.map((user) =>
              <div className={styles.friends__user} key={user._id}>
                <div>
                    <UserBlock {...user}/>
                </div>
                <Button appearance='primary' onClick={(e) => onClickRequestToFriends(e, user._id)} disabled={user.friends}>Добавить в друзья</Button>
              </div>)}
            </div>
        </div>
  )
}

export default Search
