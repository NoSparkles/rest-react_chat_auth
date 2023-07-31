import React, { useEffect } from 'react'
import useValidate from '../useValidate'
import useFetch from '../useFetch'
import { useNavigate } from 'react-router-dom'

const ChatCreatePage = () => {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useValidate()
  const [data, response, error, fetchData] = useFetch()
  const [userData, userResponse, userError, fetchUserData] = useFetch()

  useEffect(() => {
    if (loggedIn === false){
      navigate('/')
    }
    else if (loggedIn === true) {
      fetchUserData('/get-user/', 'GET', null, true)
    }
  }, [loggedIn])

  useEffect(() => {
    if (userData && userResponse){
      if (userResponse.ok){
        fetchData('/rooms/', 'POST', null, true)
      }
    }
  }, [userData])

  useEffect(() => {
    if (data && response){
      if (response.ok){
        navigate(`/chat/${data.id}/`)
      }
    }
  }, [data])

  return (
    <>
      <h1>Creating room...</h1>
    </>
  )
}

export default ChatCreatePage