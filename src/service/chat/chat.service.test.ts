// @vitest-environment node
import { it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/setup'
import { ChatService } from './chat.service'
it('uploads an image with the existing multipart field and reads its URL', async () => {
  server.use(
    http.post('http://localhost/api/chat/file', async ({ request }) => {
      const form = await request.formData()
      const file = form.get('file')
      expect(file).toBeInstanceOf(File)
      expect((file as File).name).toBe('image.png')
      return HttpResponse.json('https://example.test/image.png')
    })
  )
  expect(
    (await ChatService.uploadFile(new File(['image'], 'image.png', { type: 'image/png' }))).data
  ).toBe('https://example.test/image.png')
})
it('uploads recordings under recordMessage with the selected audio MIME type', async () => {
  server.use(
    http.post('http://localhost/api/chat/recordMessage', async ({ request }) => {
      const form = await request.formData()
      const file = form.get('recordMessage') as File
      expect(file.type).toBe('audio/webm')
      expect(await file.text()).toBe('audio')
      return HttpResponse.json('https://example.test/audio.webm')
    })
  )
  expect(
    (await ChatService.recordMessage(new File(['audio'], 'audio.webm', { type: 'audio/webm' })))
      .data
  ).toContain('audio.webm')
})
