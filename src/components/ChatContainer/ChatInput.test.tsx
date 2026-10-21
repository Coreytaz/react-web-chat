import { fireEvent, screen } from '@testing-library/react'
import { vi, it, expect } from 'vitest'
import { harness } from '../../test/helpers'
const socket = vi.hoisted(() => ({ emit: vi.fn(), connected: true }))
vi.mock('../../service/chat/socket.service', () => ({ default: socket }))
import ChatInput from './ChatInput'
it('blocks sending attachments until all uploads have finished', () => {
  const h = harness()
  h.render(
    <ChatInput
      to="other"
      editing={{
        id: 'edit',
        message: 'Hello',
        attachments: [{ id: 'pending', url: '', status: 'uploading', name: 'image.png' }]
      }}
      onCancel={vi.fn()}
    />
  )
  expect(screen.getByRole('button', { name: 'Отправить сообщение' })).toBeDisabled()
  fireEvent.submit(screen.getByRole('textbox', { name: 'Сообщение' }).closest('form')!)
  expect(socket.emit).not.toHaveBeenCalled()
})
it('edits a message without mutating the cached payload', () => {
  vi.clearAllMocks()
  const data = Object.freeze({ id: 'edit', message: 'original', attachments: [] })
  const cancel = vi.fn()
  harness().render(<ChatInput to="other" editing={data} onCancel={cancel} />)
  fireEvent.change(screen.getByRole('textbox', { name: 'Сообщение' }), {
    target: { value: 'changed' }
  })
  fireEvent.click(screen.getByRole('button', { name: 'Отправить сообщение' }))
  expect(socket.emit).toHaveBeenCalledWith('message:update', {
    id: 'edit',
    message: 'changed',
    attachments: []
  })
  expect(data.message).toBe('original')
  expect(cancel).toHaveBeenCalled()
})
