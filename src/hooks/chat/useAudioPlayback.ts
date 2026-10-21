import { useRef, useState, type SyntheticEvent } from 'react'
import { useAction } from '../useAction'
import { errorMessage } from '../../utils/errors'
export function useAudioPlayback() {
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState(0)
  const { setError } = useAction()
  const toggle = () => {
    const node = audio.current
    if (!node) return
    if (node.paused) void node.play().catch((error) => setError(errorMessage(error)))
    else node.pause()
  }
  const onLoadedMetadata = (event: SyntheticEvent<HTMLAudioElement>) => {
    const duration = event.currentTarget.duration
    setTime(Number.isFinite(duration) ? duration : 0)
  }
  const onTimeUpdate = (event: SyntheticEvent<HTMLAudioElement>) => {
    const { currentTime, duration } = event.currentTarget
    setTime(currentTime)
    setProgress(
      Number.isFinite(duration) && duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
    )
  }
  const audioEvents = {
    onLoadedMetadata,
    onTimeUpdate,
    onPlaying: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onEnded: () => {
      setPlaying(false)
      setProgress(0)
    },
    onError: () => setPlaying(false)
  }
  return { audio, playing, progress, time, toggle, audioEvents }
}
