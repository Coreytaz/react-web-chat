import { useRef, useState } from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { vi, it, expect } from 'vitest'
import DragDropMessage from './DragDropMessage'
import DragDropFile from './DragDropFile'
import { harness } from '../../test/helpers'
import type { Attachment } from '../../types/Chat.interface'
import { ChatService } from '../../service/chat/chat.service'
import { isImage } from '../../utils/files'
const image = (name = 'image.PNG') => new File(['image'], name, { type: 'image/png' })
function Upload({ initial = [] }: { initial?: Attachment[] }) {
  const [files, setFiles] = useState(initial)
  return (
    <DragDropMessage
      attachments={files}
      setAttachments={setFiles}
      savedIds={initial.map((file) => file.id)}
    >
      <span>drop target</span>
    </DragDropMessage>
  )
}
function Avatar() {
  const form = useRef<FormData | undefined>(undefined)
  return (
    <>
      <DragDropFile formDataRef={form} />
      <button
        onClick={() => {
          if (form.current) throw new Error('Selection was not cleared')
        }}
      >
        Check cancellation
      </button>
    </>
  )
}
it('accepts JPEG/PNG case-insensitively and rejects empty/unsupported extensions', () => {
  expect(isImage(image('test.PNG'))).toBe(true)
  expect(isImage(new File(['x'], 'a.JPEG', { type: 'image/jpeg' }))).toBe(true)
  expect(isImage(image('a.'))).toBe(false)
  expect(isImage(new File(['x'], 'a.png', { type: 'text/plain' }))).toBe(false)
})
it('enforces the combined limit of nine before uploading', () => {
  const upload = vi.spyOn(ChatService, 'uploadFile')
  const h = harness()
  h.render(
    <Upload
      initial={Array.from({ length: 8 }, (_, i) => ({
        id: String(i),
        url: 'saved',
        status: 'done',
        name: 'saved'
      }))}
    />
  )
  fireEvent.drop(screen.getByText('drop target'), { dataTransfer: { files: [image(), image()] } })
  expect(upload).not.toHaveBeenCalled()
  expect(h.store.getState().toastSlice.toastlist[0].description).toContain('9')
})
it('shows upload errors and allows removing the failed attachment', async () => {
  vi.spyOn(ChatService, 'uploadFile').mockRejectedValue(new Error('Upload failed'))
  const h = harness()
  h.render(<Upload />)
  fireEvent.drop(screen.getByText('drop target'), { dataTransfer: { files: [image()] } })
  await screen.findByText('Ошибка загрузки')
  fireEvent.click(screen.getByRole('button', { name: 'Удалить вложение' }))
  expect(screen.queryByText('Ошибка загрузки')).not.toBeInTheDocument()
})
it('removes an existing attachment from the draft without deleting its server file', () => {
  const remove = vi.spyOn(ChatService, 'removeFile')
  harness().render(
    <Upload
      initial={[
        { id: 'saved', name: 'saved', status: 'done', url: 'https://example.test/file.png' }
      ]}
    />
  )
  fireEvent.click(screen.getByRole('button', { name: 'Удалить вложение' }))
  expect(remove).not.toHaveBeenCalled()
})
it('handles empty avatar selection and revokes the preview on cancellation', async () => {
  const h = harness()
  h.render(<Avatar />)
  const input = screen.getByLabelText('Аватар')
  fireEvent.change(input, { target: { files: [] } })
  expect(screen.queryByRole('button', { name: 'Отменить выбор аватара' })).not.toBeInTheDocument()
  fireEvent.change(input, { target: { files: [image()] } })
  await waitFor(() =>
    expect(screen.getByRole('img', { name: 'Аватар' })).toHaveAttribute('src', 'blob:preview')
  )
  fireEvent.click(screen.getByRole('button', { name: 'Отменить выбор аватара' }))
  fireEvent.click(screen.getByText('Check cancellation'))
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview')
})
