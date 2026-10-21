import { fireEvent, screen } from '@testing-library/react'
import { vi, it, expect } from 'vitest'
import { harness } from '../../test/helpers'
const socket = vi.hoisted(() => ({ emit: vi.fn() }))
vi.mock('../../service/chat/socket.service', () => ({ default: socket }))
import MessageHeader from './MessageHeader'

it('opens on click, closes on Escape or outside click, and returns focus to its trigger', () => {
  harness().render(<MessageHeader user={{ _id: 'other', username: 'Друг', avatar: null }} />)
  const trigger = screen.getByRole('button', { name: 'Действия с перепиской' })
  expect(screen.queryByRole('button', { name: 'Удалить мои сообщения' })).not.toBeInTheDocument()
  fireEvent.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(trigger).toHaveFocus()
  fireEvent.click(trigger)
  fireEvent.pointerDown(document.body)
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(trigger)
  fireEvent.click(screen.getByRole('button', { name: 'Удалить мои сообщения' }))
  expect(socket.emit).toHaveBeenCalledWith('messages:clear', { from: 'me', to: 'other' })
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
})
