/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useEffect, useRef, useState } from 'react'
import styles from './ChatContainer.module.scss'
import cn from 'classnames'

import { ReactComponent as Wave } from '../../assets/wave.svg'
import { ReactComponent as PlaySvg } from '../../assets/play.svg'
import { ReactComponent as PauseSvg } from '../../assets/pause.svg'
import { ReactComponent as Trash } from './Trash.svg'
import { useAction } from '../../hooks/useAction'
import { formatTime } from '../../utils/formatTime'

const convertCurrentTime = (number: number): string => {
  const mins = Math.floor(number / 60)
  const secs = (number % 60).toFixed()
  return `${mins < 10 ? '0' : ''}${mins}:${+secs < 10 ? '0' : ''}${secs}`
}

const AudioMessage: FC<{ audioSrc: string, fromSelf: boolean, editingState: boolean, id: string, createdAt: Date }> = ({ audioSrc, fromSelf, editingState, id, createdAt }) => {
  const { onRemoveMes } = useAction()
  const audioElem = useRef<HTMLAudioElement>(null!)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const togglePlay = (): void => {
    if (!isPlaying) {
      void audioElem?.current.play()
    } else {
      audioElem?.current.pause()
    }
  }

  useEffect(() => {
    audioElem?.current.addEventListener(
      'loadedmetadata',
      function () {
        if (audioElem.current?.duration === Infinity) {
          audioElem.current.currentTime = 1e101
          audioElem.current.ontimeupdate = function () {
            this.ontimeupdate = () => {
              setCurrentTime(audioElem.current?.duration)
            }
            audioElem.current.currentTime = 0
          }
        }
      },
      false
    )
    audioElem?.current.addEventListener(
      'playing',
      () => {
        setIsPlaying(true)
      },
      false
    )
    audioElem?.current.addEventListener(
      'ended',
      () => {
        setIsPlaying(false)
        setProgress(0)
      },
      false
    )
    audioElem?.current.addEventListener(
      'pause',
      () => {
        setIsPlaying(false)
      },
      false
    )
    audioElem?.current.addEventListener('timeupdate', () => {
      const duration = (audioElem?.current && audioElem?.current.duration) || 0
      setCurrentTime(audioElem.current.currentTime)
      setProgress((audioElem.current.currentTime / duration) * 100)
    })
  }, [])

  return (
    <div className={cn(styles.row, styles.no_gutters)}>
      {!editingState && !isPlaying && fromSelf && <Trash className={styles.toggleSvg} onClick={() => onRemoveMes(id)} />}
        <div className={cn(styles.chat_bubble,
          {
            [styles.chat_bubble__left]: !fromSelf,
            [styles.chat_bubble__right]: fromSelf
          })}>
      <audio ref={audioElem} src={audioSrc} preload="auto" />
      <div className={styles.message__audio_progress} style={{ width: `${progress}%` }} />
        <div className={styles.message__audio_info}>
          <div className={styles.message__audio_btn}>
            <button onClick={togglePlay}>
              {isPlaying
                ? (
              <PauseSvg/>
                  )
                : (
              <PlaySvg/>
                  )}
            </button>
        </div>
        <div className={styles.message__audio_wave}>
          <Wave/>
        </div>
        <span className={styles.message__audio_duration}>{convertCurrentTime(currentTime)}</span>
      </div>
        <div className={cn(styles.time)}>{formatTime(createdAt)}</div>
        </div>
    </div>
  )
}

export default AudioMessage
