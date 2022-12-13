/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, UserBlock, UserBlockReqSkeleton } from '../components'
import { useGetFriends } from '../hooks/user/useGetFriends'
import { useReguestUser } from '../hooks/user/useReguestUser'
import { useTypedSelector } from '../hooks/useTypedSelector'
import socket from '../service/chat/socket.service'
import styles from '../style/Page/Friends.module.scss'
import { ReactComponent as Close } from '../assets/close.svg'

const Friends: React.FC = () => {
  const { _id } = useTypedSelector((state) => state.authSlice.user)
  const [search, setSearch] = React.useState<string>('')
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const usernameQuery = searchParams.get('username') ?? ''
  const section = searchParams.get('section')
  const { isLoadingRegUser, reguest, setReguest } = useReguestUser()
  const { isFetching: isLoadingFriends, friendsList } = useGetFriends(true)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const filterFriends = friendsList?.filter((friend) => friend.username.includes(usernameQuery))

  const onAcceptToFriends = (id: string): void => {
    socket.emit('accept:user', {
      sender: id,
      taker: _id,
      accept: 1
    })
    setReguest((prev) => [...prev.filter((user) => user._id !== id)])
  }

  const onClearSearch = (): void => {
    setSearchParams()
    setSearch('')
    inputRef.current?.focus()
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
                <h3>Все друзья: {filterFriends?.length}</h3>
                <Link to={'/search'}><Button appearance='primary'>Найти друзей</Button></Link>
            </div>
            <div className={styles.search__friends}>
                <Input name="Поиск" value={search} onChange={(e) => {
                  setSearch(e.target.value)
                  setSearchParams({ username: e.target.value })
                }} placeholder="Поиск друзей" required ref={inputRef} autoComplete={'off'}/>
                {search && (
                <Close className={styles.closeSearch} onClick={onClearSearch}/>
                )}
            </div>
            <div className={styles.friends__list}>
              {
                isLoadingFriends
                  ? [...new Array(3)].map((_, i) =>
                <div className={styles.friends__user} key={i}>
                  <UserBlockReqSkeleton/>
                </div>)
                  : friendsList.length > 0
                    ? filterFriends.length > 0
                      ? filterFriends.map((friends, i) =>
                    <div className={styles.friends__user} key={friends._id}>
                      <div>
                      <UserBlock {...friends}/>
                      </div>
                      <Link to={`/?sel=${friends._id}`}>
                        <Button appearance='primary'>Написать сообщение</Button>
                      </Link>
                    </div>)
                      : <h2 style={{ textAlign: 'center' }}>
                <span>😔</span>
                <br />
                Не удалось найти друзей
              </h2>
                    : (<h2 style={{ textAlign: 'center' }}>
                <span>😔</span>
                <br />
                У вас нет друзей
                <br/>
                <Link to={'/search'}><Button appearance='primary'>Найти друзей</Button></Link>
              </h2>)
              }
            </div>
        </div>
    </>
  )
}

export default Friends
