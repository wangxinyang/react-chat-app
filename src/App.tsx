import styled from '@emotion/styled'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const MessageWrapper = styled.div`
  padding: 10px 10px;
`

const MessageAuthor = styled.span`
  font-size: 20px;
  font-weight: bold;
`

const Message = styled.div`
  margin-top: 5px;
  font-size: 16px;
`

const TypeMessageContainer = styled.div`
  margin-top: 105px;
  padding: 0 20px;
`

const TypeMessageInput = styled.input`
  width: 350px;
  height: 30px;
  margin-top: 10px;
`

type Message = {
  author: string
  content: string
}

function App() {
  const [author, setAuthor] = useState('')
  const [messages, setMessage] = useState<Message[]>([])
  const authorRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLInputElement>(null)

  const socket = io('http://localhost:3100', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    // autoConnect: false,
  })

  useEffect(() => {
    socket.on('chat message', (arg: { author: string; content: string }) => {
      setMessage([...messages, { author: arg.author, content: arg.content }])
    })
  }, [socket])

  const handleInputMessage = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const content = (e.target as HTMLInputElement).value
      contentRef.current!.value = ''
      if (content) socket.emit('chat message', { author, content })
    }
  }

  const handleAuthorInputMessage = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const author = (e.target as HTMLInputElement).value
      authorRef.current!.value = ''
      if (author) setAuthor(author)
    }
  }

  return (
    <div>
      <h1>React Chat App</h1>
      {messages?.map((item, index) => {
        return (
          <MessageWrapper key={index}>
            <MessageAuthor>{item.author}</MessageAuthor>
            <Message>{item.content}</Message>
          </MessageWrapper>
        )
      })}
      {!author ? (
        <TypeMessageContainer>
          <div>Hi, what is your name?</div>
          <TypeMessageInput type="text" ref={authorRef} onKeyDown={handleAuthorInputMessage} />
        </TypeMessageContainer>
      ) : (
        <TypeMessageContainer>
          <div>Hello {author}, type a message</div>
          <TypeMessageInput type="text" onKeyDown={handleInputMessage} ref={contentRef} />
        </TypeMessageContainer>
      )}
    </div>
  )
}

export default App
