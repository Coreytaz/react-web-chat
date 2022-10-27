import React from 'react'
import { useSelector } from 'react-redux'
import { Button, DragDropFile, Form } from '../components'
import { RootState } from '../redux/store'
import styles from '../style/Page/Profile.module.scss'

const Profile = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.authSlice)

  return (
    <>
    <Form className={styles.form} onSubmit={e => e.preventDefault()}>
        <h2 className={styles.title}>Профиль: {user?.username}</h2>
        <div className={styles.inputs}>
          <DragDropFile/>
            <Button appearance="primary" >Обновить</Button>
        </ div>
    </Form>
    </>
  )
}

export default Profile
