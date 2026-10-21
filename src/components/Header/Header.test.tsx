import { fireEvent, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import { harness } from '../../test/helpers'
import Header from './Header'

it('opens the profile menu by button and dismisses on Escape, navigation and outside click', () => {
  harness().render(<Header />)
  const trigger = screen.getByRole('button', { name: 'Меню пользователя' })
  fireEvent.click(trigger)
  expect(screen.getByRole('link', { name: 'Профиль' })).toBeVisible()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(trigger).toHaveFocus()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(trigger)
  fireEvent.click(screen.getByRole('link', { name: 'Друзья' }))
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(trigger)
  fireEvent.pointerDown(document.body)
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
})
