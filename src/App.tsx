import styled from '@emotion/styled'
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { useSocket } from './context/socket-context'
import { useDebounce } from './utils'

const MessageContainer = styled.div`
  height: 300px;
  overflow-y: scroll;
  margin: 0 50px;
  border: 1px solid #f6f6f6;
`

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
  width: 350px;
  margin: 105px auto 0;
  padding: 0 20px;
`

const TypeMessageInput = styled.input`
  width: 100%;
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
  const socket = useSocket()

  useEffect(() => {
    socket.on('chat message', (arg: Message) => {
      setMessage([...messages, { author: arg.author, content: arg.content }])
      const msgEnd = document.getElementById('msg_end')
      if (msgEnd)
        setTimeout(() => {
          msgEnd.scrollIntoView(false)
        }, 100)
    })
  }, [messages])

  const handleEnterEvent = (e: KeyboardEvent<HTMLInputElement>) => {
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
      <MessageContainer>
        {messages?.map((item, index) => {
          return (
            <MessageWrapper key={index}>
              <MessageAuthor>{item.author}</MessageAuthor>
              <Message>{item.content}</Message>
            </MessageWrapper>
          )
        })}
        <span id="msg_end" style={{ overflow: 'hidden' }}></span>
      </MessageContainer>
      {!author ? (
        <TypeMessageContainer>
          <div>Hi, what is your name?</div>
          <TypeMessageInput type="text" ref={authorRef} onKeyUp={handleAuthorInputMessage} />
        </TypeMessageContainer>
      ) : (
        <TypeMessageContainer>
          <div>Hello {author}, type a message</div>
          <TypeMessageInput type="text" onKeyUp={handleEnterEvent} ref={contentRef} />
        </TypeMessageContainer>
      )}
    </div>
  )
}

export default App
