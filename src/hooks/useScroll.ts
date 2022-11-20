/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState, useRef } from 'react'

const useOnScreen = (ref: React.MutableRefObject<HTMLDivElement>): boolean => {
  const observerRef = useRef<IntersectionObserver>(null!)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    const options = {
      rootMargin: '0px',
      threshold: 1
    }
    observerRef.current = new IntersectionObserver(([target]) => {
      setIsOnScreen(target.isIntersecting)
    }, options)
  }, [])

  useEffect(() => {
    observerRef.current?.observe(ref.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [ref])

  return isOnScreen
}

export default useOnScreen
