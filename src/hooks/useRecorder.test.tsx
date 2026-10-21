import { act, renderHook, waitFor } from '@testing-library/react'
import { vi, it, expect, beforeEach } from 'vitest'
import { useRecorder } from './useRecorder'
import { harness } from '../test/helpers'
import { ChatService } from '../service/chat/chat.service'
class Recorder {
  static instance: Recorder
  static isTypeSupported = vi.fn((mime: string) => mime.startsWith('audio/webm'))
  state = 'inactive'
  mimeType = 'audio/webm'
  ondataavailable: ((event: { data: Blob }) => void) | null = null
  onstop: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor() {
    Recorder.instance = this
  }
  start() {
    this.state = 'recording'
  }
  stop() {
    this.state = 'inactive'
    this.ondataavailable?.({ data: new Blob(['audio'], { type: this.mimeType }) })
    this.onstop?.()
  }
}
const stop = vi.fn()
const media = { getTracks: () => [{ stop }] } as unknown as MediaStream
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal('MediaRecorder', Recorder)
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: vi.fn().mockResolvedValue(media) }
  })
})
it('sends a typed audio file and stops every microphone track', async () => {
  const upload = vi
    .spyOn(ChatService, 'recordMessage')
    .mockResolvedValue({ data: 'https://example.test/audio.webm' } as Awaited<
      ReturnType<typeof ChatService.recordMessage>
    >)
  const send = vi.fn()
  const h = harness()
  const { result } = renderHook(() => useRecorder(send), { wrapper: h.wrapper })
  await act(() => result.current.start())
  expect(result.current.isRecording).toBe(true)
  await act(() => result.current.stop())
  await waitFor(() => expect(send).toHaveBeenCalledWith('https://example.test/audio.webm'))
  expect(stop).toHaveBeenCalled()
  expect(upload.mock.calls[0][0].type).toBe('audio/webm')
})
it('cancels without uploading or sending', async () => {
  const upload = vi.spyOn(ChatService, 'recordMessage')
  const send = vi.fn()
  const h = harness()
  const { result } = renderHook(() => useRecorder(send), { wrapper: h.wrapper })
  await act(() => result.current.start())
  act(() => result.current.cancel())
  expect(result.current.isRecording).toBe(false)
  expect(stop).toHaveBeenCalled()
  expect(upload).not.toHaveBeenCalled()
  expect(send).not.toHaveBeenCalled()
})
it('releases permission results that arrive after unmount', async () => {
  let resolve: (media: MediaStream) => void = () => {}
  vi.mocked(navigator.mediaDevices.getUserMedia).mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  const h = harness()
  const { result, unmount } = renderHook(() => useRecorder(vi.fn()), { wrapper: h.wrapper })
  let task: Promise<void>
  act(() => {
    task = result.current.start()
  })
  unmount()
  await act(async () => {
    resolve(media)
    await task
  })
  expect(stop).toHaveBeenCalledTimes(1)
})
it('reports permission rejection and remains usable', async () => {
  vi.mocked(navigator.mediaDevices.getUserMedia).mockRejectedValue(new Error('Permission denied'))
  const h = harness()
  const { result } = renderHook(() => useRecorder(vi.fn()), { wrapper: h.wrapper })
  await act(() => result.current.start())
  expect(result.current.isRecording).toBe(false)
  expect(result.current.isBusy).toBe(false)
  expect(h.store.getState().toastSlice.toastlist[0].description).toBe('Permission denied')
})
it('aborts an upload and suppresses a late send on unmount', async () => {
  let resolve: (value: Awaited<ReturnType<typeof ChatService.recordMessage>>) => void = () => {}
  const upload = vi.spyOn(ChatService, 'recordMessage').mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  const send = vi.fn()
  const h = harness()
  const { result, unmount } = renderHook(() => useRecorder(send), { wrapper: h.wrapper })
  await act(() => result.current.start())
  act(() => result.current.stop())
  unmount()
  await act(async () =>
    resolve({ data: 'late' } as Awaited<ReturnType<typeof ChatService.recordMessage>>)
  )
  expect(upload.mock.calls[0][1]?.aborted).toBe(true)
  expect(send).not.toHaveBeenCalled()
})
