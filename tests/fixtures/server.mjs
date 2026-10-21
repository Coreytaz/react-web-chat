// Disposable local fixture. No database, external services, or real user data.
import { createServer } from 'node:http'
import { Server } from 'socket.io'
const users = [
  { _id: 'alice', login: 'alice', username: 'Алиса', email: 'alice@example.test', avatar: null },
  { _id: 'boris', login: 'boris', username: 'Борис', email: 'boris@example.test', avatar: null }
]
const now = new Date().toISOString()
let messages = [
  {
    id: 'welcome',
    from: 'boris',
    to: 'alice',
    message: 'Привет! Проверяем обновлённый чат.',
    createdAt: now,
    updatedAt: now,
    attachments: [],
    voiceMessage: null
  }
]
const json = (res, value, status = 200) => {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(value))
}
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const cookie = (req.headers.cookie || '').match(/fixture=([^;]+)/)?.[1]
  const user = users.find((u) => u._id === cookie)
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  let body = {}
  try {
    body = JSON.parse(Buffer.concat(chunks).toString())
  } catch {
    /* Non-JSON endpoints have no request body. */
  }
  if (url.pathname === '/api/auth/login') {
    const login = users.find((u) => u.login === body.EmailorLogin)
    if (!login) return json(res, { message: 'Используйте alice или boris', error: 'Ошибка' }, 401)
    res.setHeader('Set-Cookie', 'fixture=' + login._id + '; Path=/; HttpOnly; SameSite=Lax')
    return json(res, { user: login })
  }
  if (url.pathname === '/api/auth/refresh')
    return json(res, user ? { user } : { message: 'Нет сессии' }, user ? 200 : 401)
  if (url.pathname === '/api/auth/logout') {
    res.setHeader('Set-Cookie', 'fixture=; Max-Age=0; Path=/')
    return json(res, null)
  }
  if (url.pathname === '/socket.io/') return
  if (!user) return json(res, { message: 'Нет сессии' }, 401)
  if (url.pathname === '/api/user/getFriends')
    return json(
      res,
      users.filter((u) => u._id !== user._id)
    )
  if (url.pathname === '/api/user/getReguestUser') return json(res, [])
  if (url.pathname === '/api/user/search') {
    const found = users.filter(
      (u) =>
        u._id !== user._id &&
        u.username.toLowerCase().includes((url.searchParams.get('username') || '').toLowerCase())
    )
    return json(res, { items: found.map((u) => ({ ...u, friends: true })), total: found.length })
  }
  if (url.pathname === '/api/user/getUser')
    return json(res, users.find((u) => u._id === url.searchParams.get('_id')) || null)
  if (url.pathname === '/api/user/me') {
    Object.assign(user, body)
    return json(res, { user })
  }
  if (url.pathname === '/api/chat/getMessages') {
    const page = Number(url.searchParams.get('page') || 0)
    const limit = Number(url.searchParams.get('limit') || 30)
    const found = messages.filter(
      (m) =>
        (m.from === body.from && m.to === body.to) || (m.from === body.to && m.to === body.from)
    )
    return json(
      res,
      found
        .slice()
        .reverse()
        .slice(page * limit, (page + 1) * limit)
        .reverse()
        .map((m) => ({ ...m, fromSelf: m.from === body.from }))
    )
  }
  return json(res, { message: 'Этот endpoint не реализован тестовым сервером' }, 404)
})
const io = new Server(server, { cors: { origin: true, credentials: true } })
const online = new Map()
io.on('connection', (socket) => {
  socket.on('ADD-USER', (id) => {
    socket.join(id)
    online.set(socket.id, id)
    io.emit('ADD-USER-STATUS', [...online.values()])
  })
  socket.on('disconnect', () => {
    online.delete(socket.id)
    io.emit('ADD-USER-STATUS', [...online.values()])
  })
  socket.on('SEND-MESG', (payload) => {
    const date = new Date().toISOString()
    const data = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: date,
      updatedAt: date,
      voiceMessage: payload.voiceMessage || null
    }
    messages.push(data)
    io.to(payload.from).emit('MESG-YOU', data)
    io.to(payload.to).emit('MESG-RECIEVE', data)
  })
  socket.on('message:update', (payload) => {
    const data = messages.find((m) => m.id === payload.id)
    if (!data) return
    Object.assign(data, payload, { updatedAt: new Date().toISOString() })
    io.emit('message:update-RECIEVE', { updatedMessage: { ...data, _id: data.id } })
  })
  socket.on('message:delete', (id) => {
    const data = messages.find((m) => m.id === id)
    messages = messages.filter((m) => m.id !== id)
    if (data) io.emit('message:delete-RECIEVE', { removedMessage: { ...data, _id: id } })
  })
  socket.on('messages:clear', () => io.emit('messages:clear-recieve'))
})
server.listen(Number(process.env.FIXTURE_PORT ?? 5050), '127.0.0.1', () =>
  console.log(
    'Disposable chat fixture: http://127.0.0.1:' +
      server.address().port +
      ' (alice / boris, any nonempty password)'
  )
)
