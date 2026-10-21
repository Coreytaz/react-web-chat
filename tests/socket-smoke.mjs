import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { io } from 'socket.io-client'
const child = spawn(
  process.execPath,
  [fileURLToPath(new URL('./fixtures/server.mjs', import.meta.url))],
  {
    env: { ...process.env, FIXTURE_PORT: '0' },
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  }
)
const timeout = setTimeout(() => {
  child.kill()
  console.error('Fixture smoke test timed out')
  process.exitCode = 1
}, 15000)
let alice, boris
try {
  const [ready] = await once(child.stdout, 'data')
  const match = String(ready).match(/127\.0\.0\.1:(\d+)/)
  assert.ok(match, 'Fixture did not report its port')
  const base = 'http://127.0.0.1:' + match[1]
  async function login(name) {
    const res = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ EmailorLogin: name, password: 'fixture' })
    })
    assert.equal(res.status, 200)
    return res.headers.get('set-cookie').split(';')[0]
  }
  const aliceCookie = await login('alice'),
    borisCookie = await login('boris')
  assert.notEqual(aliceCookie, borisCookie)
  for (const [cookie, id] of [
    [aliceCookie, 'alice'],
    [borisCookie, 'boris']
  ]) {
    const res = await fetch(base + '/api/auth/refresh', { headers: { Cookie: cookie } })
    assert.equal((await res.json()).user._id, id)
  }
  alice = io(base, { autoConnect: false })
  boris = io(base, { autoConnect: false })
  let connected = once(alice, 'connect')
  alice.connect()
  await connected
  connected = once(boris, 'connect')
  boris.connect()
  await connected
  const online = once(alice, 'ADD-USER-STATUS')
  alice.emit('ADD-USER', 'alice')
  await online
  const bothOnline = once(boris, 'ADD-USER-STATUS')
  boris.emit('ADD-USER', 'boris')
  await bothOnline
  const own = once(alice, 'MESG-YOU'),
    received = once(boris, 'MESG-RECIEVE')
  alice.emit('SEND-MESG', { from: 'alice', to: 'boris', message: 'fixture smoke', attachments: [] })
  const [sent] = await own
  const [incoming] = await received
  assert.equal(sent.id, incoming.id)
  assert.equal(incoming.message, 'fixture smoke')
  const history = await fetch(base + '/api/chat/getMessages?page=0&limit=30', {
    method: 'POST',
    headers: { Cookie: borisCookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'boris', to: 'alice' })
  })
  assert.ok((await history.json()).some((message) => message.id === sent.id && !message.fromSelf))
  const updated = once(boris, 'message:update-RECIEVE')
  alice.emit('message:update', { id: sent.id, message: 'edited', attachments: [] })
  assert.equal((await updated)[0].updatedMessage.message, 'edited')
  const deleted = once(boris, 'message:delete-RECIEVE')
  alice.emit('message:delete', sent.id)
  assert.equal((await deleted)[0].removedMessage._id, sent.id)
  alice.disconnect()
  connected = once(alice, 'connect')
  alice.connect()
  await connected
  const rejoined = once(alice, 'ADD-USER-STATUS')
  alice.emit('ADD-USER', 'alice')
  await rejoined
  console.log(
    'PASS: two isolated HTTP sessions, socket delivery/echo, history, edit/delete and reconnect against the disposable fixture'
  )
} finally {
  alice?.disconnect()
  boris?.disconnect()
  clearTimeout(timeout)
  child.kill()
}
