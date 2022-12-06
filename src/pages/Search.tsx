/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Input, UserBlock, UserBlockReqSkeleton } from '../components'
import useDebounce from '../hooks/useDebounce'
import { useSearchUsers } from '../hooks/user/useSearchUsers'
import { useTypedSelector } from '../hooks/useTypedSelector'
import socket from '../service/chat/socket.service'
import { ReactComponent as Close } from '../assets/close.svg'
import styles from '../style/Page/Search.module.scss'
import { off } from 'process'

const Search: React.FC = () => {
  const navigate = useNavigate()
  const [_, setSearchParams] = useSearchParams()
  const [search, setSearch] = React.useState<string>('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { refetch, isFetching, userList } = useSearchUsers()
  const { _id } = useTypedSelector((state) => state.authSlice.user)
  const debouncedValue = useDebounce<string>(search, 500)

  React.useEffect(() => {
    void refetch()
  }, [debouncedValue, refetch])

  const onClickRequestToFriends = (e: React.MouseEvent<HTMLButtonElement>, id: string): void => {
    socket.emit('reguest:user', {
      sender: _id,
      taker: id
    })
    e.currentTarget.disabled = true
  }

  const onClearSearch = (): void => {
    setSearchParams()
    setSearch('')
    inputRef.current?.focus()
  }

  return (
    <div className={styles.friend__block}>
            <div className={styles.friend__header}>
                <span onClick={() => navigate('/friends')}>Назад</span>
                <h3>Все пользователя {userList?.total}</h3>
            </div>
            <div className={styles.search__friends}>
                <Input name="Поиск" value={search} onChange={(e) => {
                  setSearch(e.target.value)
                  setSearchParams({ username: e.target.value })
                }} placeholder="Введите запрос" required ref={inputRef} autoComplete={'off'}/>
                {search && (
                <Close className={styles.closeSearch} onClick={onClearSearch}/>
                )}
            </div>
            <div className={styles.friends__list}>
            {isFetching
              ? [...new Array(5)].map((_, i) => <div className={styles.friends__user} key={i}>
              <UserBlockReqSkeleton/>
          </div>)
              : userList?.items.length > 0
                ? userList?.items.map((user) =>
              <div className={styles.friends__user} key={user._id}>
                <div>
                    <UserBlock {...user}/>
                </div>
                <Button appearance='primary' onClick={(e) => onClickRequestToFriends(e, user._id)} disabled={user.friends}>Добавить в друзья</Button>
              </div>)
                : <h2 style={{ textAlign: 'center' }}>
                <span>😔</span>
                <br />
                Не удалось найти пользователя
              </h2>}
            </div>
        </div>
  )
}

export default Search
