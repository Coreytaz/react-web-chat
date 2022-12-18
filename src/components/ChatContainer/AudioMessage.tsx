/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FC, useEffect, useRef, useState } from 'react'
import styles from './ChatContainer.module.scss'
import cn from 'classnames'

import { ReactComponent as Wave } from '../../assets/wave.svg'
import { ReactComponent as PlaySvg } from '../../assets/play.svg'
import { ReactComponent as PauseSvg } from '../../assets/pause.svg'
import sound from '../../assets/tempS.ogg'

const convertCurrentTime = (number: number): string => {
  const mins = Math.floor(number / 60)
  const secs = (number % 60).toFixed()
  return `${mins < 10 ? '0' : ''}${mins}:${+secs < 10 ? '0' : ''}${secs}`
}

const AudioMessage: FC = () => {
  const audioElem = useRef<HTMLAudioElement>(null!)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const fromSelf = true

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
      () => {
        setCurrentTime(audioElem.current?.duration)
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
        <div className={cn(styles.chat_bubble,
          {
            [styles.chat_bubble__left]: !fromSelf,
            [styles.chat_bubble__right]: fromSelf
          })}>
      <audio ref={audioElem} src={sound} preload="auto" />
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
        </div>
    </div>
  )
}

export default AudioMessage
