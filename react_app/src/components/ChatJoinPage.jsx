import React, {useEffect, useState} from 'react'
import useValidate from '../useValidate'
import useFetch from '../useFetch'
import { useNavigate } from 'react-router-dom'

const ChatJoinPage = () => {
  const [id, setId] = useState('')
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useValidate()
  const [data, response, error, fetchData] = useFetch()

  useEffect(() => {
    if (loggedIn === false){
      navigate('/')
    }
  }, [loggedIn])

  useEffect(() => {
    if (data && response.ok){
      navigate(`/chat/${id}/`)
    }
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchData(`/rooms/${id}/`, 'GET', null, true)
  }
  return (
    <>
      <form action="" onSubmit={handleSubmit}>
        <input type="text" name='id' placeholder='Room id' onChange={(e) => setId(e.target.value)}/>
        <input type="submit"/>
      </form>
      {
        error ? (<p>Room not found</p>) : <></>
      }
    </>
  )
}

export default ChatJoinPage