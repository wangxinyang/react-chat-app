import React, { ReactNode } from 'react'
import { SocketProvider } from './socket-context'

function AppProviders({ children }: { children: ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>
}

export default AppProviders
