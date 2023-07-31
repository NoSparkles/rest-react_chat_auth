import React, { useEffect, useRef, useState } from 'react'
import useFetch from '../useFetch'
import { json, useNavigate, useParams } from 'react-router-dom'
import useValidate from '../useValidate'

const ChatPage = () => {
  const [loggedIn, setLoggedIn] = useValidate()
  let navigate = useNavigate()
  let [message, setMessage] = useState('')
  let params = useParams()
  let [userData, userResponse,  userError, fetchUserData] = useFetch()
  let [data, response,  error, fetchData] = useFetch()
  const [chatSocket, setChatSocket] = useState(null);
  const [wsMessages, setWsMessages] = useState([])
  let messagesDiv = useRef()

  useEffect(() => {
    console.log('wsmessages', wsMessages)
  }, [wsMessages])

  useEffect(() => {
    if (!chatSocket) {
      const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${params.id}/`);
      setChatSocket(newSocket);
    }
    else if (chatSocket){
      chatSocket.onmessage = (e) => {
        let wsdata = JSON.parse(e.data)
        console.log('Data: ', wsdata)
        if (wsdata.type === 'chat'){
          wsdata = JSON.parse(wsdata.message)
          console.log('wsdata', wsdata)
          setWsMessages((prev) => [...prev, {
            username: wsdata.username,
            content: wsdata.message
          }])
          
        }
      }
    }

    return () => {
      if (chatSocket) {
        chatSocket.close();
      }
    };
  }, [chatSocket]);
  
  useEffect(() => {
    if (loggedIn === false){
      navigate('/')
    }
    if (loggedIn === true){
      fetchUserData(`/get-user/`, 'GET', null, true)
      fetchData(`/rooms/${params.id}/`, 'GET', null,  true)
    }
  }, [loggedIn])

  useEffect(() => {
    if (userData && userResponse){
      if(!userResponse.ok){
        navigate('/')
      }
    }
  }, [userData])

  useEffect(() => {
    if (data && response){
      if(!response.ok){
        navigate('/')
      }
    }
  }, [data])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if(chatSocket){
      chatSocket.send(JSON.stringify({
        username: userData.username,
        message: message
      }))
      setMessage('')
    }
  }

  return (
    <>
      {
        data && userData ? (
          <>
          <h2>Let's chat, {userData.username}</h2>
          <h3>Users:</h3>
          <div id='users'>
            {data.users.map((item, i) => (
              <div key={i}>
                <p>{item.username}</p>
               <br />
              </div>
            ))}
          </div>
          <h3>Messages:</h3>
          <div ref={messagesDiv} id='messages'>
            {data.messages.map((item, i) => (
              <p key={i}>{item.username}: {item.content}</p>
            ))}
            {wsMessages.map((item, i) => (
              <p key={i}>{item.username}: {item.content}</p>
            ))}
          </div>
          <form onSubmit={handleSubmit}>
            <input required type="text" name='message' placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)}/>
            <input type="submit" value='send'/>
          </form>
          </>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default ChatPage