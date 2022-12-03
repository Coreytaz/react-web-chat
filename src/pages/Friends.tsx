/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, UserBlock, UserBlockReqSkeleton } from '../components'
import { useGetFriends } from '../hooks/user/useGetFriends'
import { useReguestUser } from '../hooks/user/useReguestUser'
import { useTypedSelector } from '../hooks/useTypedSelector'
import socket from '../service/chat/socket.service'
import styles from '../style/Page/Friends.module.scss'

const Friends: React.FC = () => {
  const { _id } = useTypedSelector((state) => state.authSlice.user)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const section = searchParams.get('section')
  const { isLoadingRegUser, reguest, setReguest } = useReguestUser()
  const { isFetching: isLoadingFriends, friendsList } = useGetFriends(true)

  const onAcceptToFriends = (id: string): void => {
    socket.emit('accept:user', {
      sender: id,
      taker: _id,
      accept: 1
    })
    setReguest((prev) => [...prev.filter((user) => user._id !== id)])
  }

  if (section === 'requests' && reguest.length > 0) {
    return (
    <div className={styles.friend__req_block}>
        <div className={styles.friend__req_header}>
            <span onClick={() => navigate(-1)}>Назад</span>
            <h3>Заявки в друзья: {reguest.length}</h3>
        </div>
        <div className={styles.friend__req_body}>
        {isLoadingRegUser
          ? [...new Array(5)].map((_, i) => <div className={styles.friend__req_user} key={i}>
              <UserBlockReqSkeleton/>
          </div>)
          : reguest.map((user) =>
              <div className={styles.friend__req_user} key={user._id}>
                <div>
                    <UserBlock {...user}/>
                </div>
                <Button appearance='primary' onClick={() => onAcceptToFriends(user._id)}>Добавить в друзья</Button>
              </div>)}
        </div>
    </div>)
  }

  return (
    <>
        {reguest.length > 0 && <div className={styles.friend__req_block}>
            <div className={styles.friend__req_header}>
                <h3>Заявки в друзья: {reguest.length}</h3>
                <span><Link to={'?section=requests'}>Показать все</Link></span>
            </div>
            <div className={styles.friend__req_body}>
            {isLoadingRegUser
              ? [...new Array(1)].map((_, i) => <div className={styles.friend__req_user} key={i}>
              <UserBlockReqSkeleton/>
          </div>)
              : [...new Array(1)].map(() =>
              <div className={styles.friend__req_user} key={reguest[0]?._id}>
                <div>
                    <UserBlock {...reguest[0]}/>
                </div>
                <Button appearance='primary' onClick={() => onAcceptToFriends(reguest[0]._id)}>Добавить в друзья</Button>
              </div>)}
            </div>
        </div>}
        <div className={styles.friend__block}>
            <div className={styles.friend__header}>
                <h3>Все друзья: {friendsList?.length}</h3>
                <Button appearance='primary'><Link to={'/search'}>Найти друзей</Link></Button>
            </div>
            <div className={styles.search__friends}>
                <Input name="Поиск" placeholder="Поиск друзей" required />
            </div>
            <div className={styles.friends__list}>
              {
                isLoadingFriends
                  ? [...new Array(3)].map((_, i) =>
                <div className={styles.friends__user} key={i}>
                  <UserBlockReqSkeleton/>
                </div>)
                  : friendsList?.map((friends, i) => <div className={styles.friends__user} key={friends._id}>
                  <UserBlock {...friends}/>
                </div>)
              }
            </div>
        </div>
    </>
  )
}

export default Friends
