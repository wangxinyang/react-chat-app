import { createContext, ReactNode, useContext } from 'react'
import { io, Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)
SocketContext.displayName = 'SocketContext'

const socket = io('http://localhost:3100', {
  withCredentials: true,
  transports: ['websocket', 'polling'],
})

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  return <SocketContext.Provider value={socket} children={children} />
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket必须在SocketProvider中使用')
  }
  return context
}
