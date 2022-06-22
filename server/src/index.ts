import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

io.on('connection', (socket) => {
  socket.join('client-1')
  socket.on('chat message', (params: { author: string; content: string }) => {
    io.to('client-1').emit('chat message', {
      author: params.author,
      content: params.content,
    })
  })
})

httpServer.listen(3100)
