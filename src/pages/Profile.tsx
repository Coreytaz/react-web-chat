/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { Button, DragDropFile, Form } from '../components'
import { setList } from '../redux/slice/toastSlice'
import { RootState, useAppDispatch } from '../redux/store'
import { UserService } from '../service/user/user.service'
import styles from '../style/Page/Profile.module.scss'

const Profile = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.authSlice)
  const dispatch = useAppDispatch()
  const formDataRef = React.useRef<FormData>()

  const { mutateAsync: avatarAsync, isLoading } = useMutation('avatar', async () => await UserService.avatar(formDataRef.current), {
    onError: (err: any) => {
      const res: any = err.response?.data
      if (Array.isArray(res.message)) {
        res.message.map((data: any) => dispatch(setList({
          id: Date.now(),
          title: 'Error',
          description: data,
          backgroundColor: '#bd362f'
        })))
      } else {
        dispatch(setList({
          id: Date.now(),
          title: 'Error',
          description: res.message,
          backgroundColor: '#bd362f'
        }))
      }
    },
    onSuccess: ({ data }) => {
      dispatch(setList({
        id: Date.now(),
        title: 'Success',
        description: data.message,
        backgroundColor: '#5cb85c'
      }))
    }
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    void avatarAsync()
  }

  return (
    <>
    <Form className={styles.form} onSubmit={e => onSubmit(e)} encType='multipart/form-data'>
        <h2 className={styles.title}>Профиль: {user?.username}</h2>
        <div className={styles.inputs}>
          <DragDropFile formDataRef={formDataRef}/>
            <Button appearance="primary" type="submit" disabled={isLoading}>Обновить</Button>
        </ div>
    </Form>
    </>
  )
}

export default Profile
