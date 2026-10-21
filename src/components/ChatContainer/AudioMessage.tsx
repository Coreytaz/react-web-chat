import { useAudioPlayback } from '../../hooks/chat/useAudioPlayback'
import cn from 'classnames'
import styles from './ChatContainer.module.scss'
import Wave from '../../assets/wave.svg?react'
import Play from '../../assets/play.svg?react'
import Pause from '../../assets/pause.svg?react'
import Trash from './Trash.svg?react'
import socket from '../../service/chat/socket.service'
import { formatTime } from '../../utils/formatTime'
export function audioTime(value: number) {
  const time = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0
  return String(Math.floor(time / 60)).padStart(2, '0') + ':' + String(time % 60).padStart(2, '0')
}
export default function AudioMessage({
  audioSrc,
  fromSelf,
  editingState,
  id,
  createdAt
}: {
  audioSrc: string
  fromSelf: boolean
  editingState: boolean
  id: string
  createdAt: string
}) {
  const { audio, playing, progress, time, toggle, audioEvents } = useAudioPlayback()
  return (
    <div className={cn(styles.row, styles.no_gutters)}>
      {!editingState && !playing && fromSelf ? (
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
        <audio ref={audio} src={audioSrc} preload="metadata" {...audioEvents} />
        <div className={styles.message__audio_progress} style={{ width: progress + '%' }} />
        <div className={styles.message__audio_info}>
          <div className={styles.message__audio_btn}>
            <button type="button" aria-label={playing ? 'Пауза' : 'Воспроизвести'} onClick={toggle}>
              {playing ? <Pause /> : <Play />}
            </button>
          </div>
          <div className={styles.message__audio_wave}>
            <Wave />
          </div>
          <span className={styles.message__audio_duration}>{audioTime(time)}</span>
        </div>
        <div className={styles.time}>{formatTime(createdAt)}</div>
      </div>
    </div>
  )
}
