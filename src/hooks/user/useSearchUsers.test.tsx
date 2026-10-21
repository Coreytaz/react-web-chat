import { fireEvent, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse, delay } from 'msw'
import { it, expect } from 'vitest'
import { server } from '../../test/setup'
import { harness } from '../../test/helpers'
import Search from '../../pages/Search'
it('debounces URL search and ignores slow previous results', async () => {
  const searches: string[] = []
  server.use(
    http.get('http://localhost/api/user/search', async ({ request }) => {
      const name = new URL(request.url).searchParams.get('username') || ''
      searches.push(name)
      if (name === 'old') await delay(800)
      return HttpResponse.json({
        total: 1,
        items: [{ _id: name || 'initial', username: name || 'Initial', avatar: null }]
      })
    })
  )
  const h = harness(true, '/search?username=old')
  h.render(<Search />)
  expect(screen.getByLabelText('Введите запрос')).toHaveValue('old')
  fireEvent.change(screen.getByLabelText('Введите запрос'), { target: { value: 'ne' } })
  fireEvent.change(screen.getByLabelText('Введите запрос'), { target: { value: 'new' } })
  await screen.findByText('new', {}, { timeout: 2000 })
  await waitFor(() => expect(searches).toEqual(['old', 'new']))
  expect(screen.queryByText('old')).not.toBeInTheDocument()
})
