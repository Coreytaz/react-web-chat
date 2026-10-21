import { useState } from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { harness } from '../../test/helpers'
import UserSearchField from './UserSearchField'

it('clears the search and returns focus to the input', () => {
  function SearchField() {
    const [value, setValue] = useState('Борис')
    return (
      <UserSearchField
        value={value}
        onChange={setValue}
        placeholder="Поиск друзей"
        className=""
        clearClassName=""
      />
    )
  }
  harness().render(<SearchField />)
  fireEvent.click(screen.getByRole('button', { name: 'Очистить поиск' }))
  expect(screen.getByRole('textbox', { name: 'Поиск друзей' })).toHaveValue('')
  expect(screen.getByRole('textbox', { name: 'Поиск друзей' })).toHaveFocus()
  expect(screen.queryByRole('button', { name: 'Очистить поиск' })).not.toBeInTheDocument()
})
