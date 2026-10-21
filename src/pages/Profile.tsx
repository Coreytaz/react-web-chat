import { useRef, useState } from 'react'
import Button from '../components/UI/Button/Button'
import DragDropFile from '../components/DragDropFile/DragDropFile'
import Input from '../components/UI/Input/Input'
import { useAvatar } from '../hooks/user/useAvatar'
import { useUpdateUser } from '../hooks/user/useUpdateUser'
import { useTypedSelector } from '../hooks/useTypedSelector'
import styles from '../style/Page/Profile.module.scss'
export default function Profile() {
  const user = useTypedSelector((s) => s.authSlice.user)
  const [email, setEmail] = useState(user.email)
  const [username, setUsername] = useState(user.username)
  const form = useRef<FormData | undefined>(undefined)
  const avatar = useAvatar(form)
  const update = useUpdateUser(email, username)
  const busy = avatar.isPending || update.isPending
  return (
    <form
      className={styles.form}
      encType="multipart/form-data"
      onSubmit={(e) => {
        e.preventDefault()
        if (busy) return
        if (form.current?.has('avatar')) avatar.avatarAsync()
        if (email !== user.email || username !== user.username) update.userAsync()
      }}
    >
      <h2 className={styles.title}>Профиль: {user.username}</h2>
      <div className={styles.inputs}>
        <Input
          name="Почта"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Почта"
          required
          disabled={busy}
        />
        <Input
          name="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
          required
          disabled={busy}
        />
        <DragDropFile formDataRef={form} disabled={busy} />
        <Button appearance="primary" type="submit" disabled={busy}>
          Обновить
        </Button>
      </div>
    </form>
  )
}
