import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useValidate from '../useValidate'

const RegisterPage = () => {
  const [loggedIn, setLoggedIn] = useValidate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    let endpoint = 'http://localhost:8000/api/users/'
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }
    fetch(endpoint, options)
    .then(response=>response.json())
    .then(data=>{
      console.log(data)
      if (data.username === username){
        getToken()
      }
    })
  }

  const getToken = () => {
    let endpoint = 'http://localhost:8000/api/token/'
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }
    fetch(endpoint, options)
    .then(response=>response.json())
    .then(data=>{
        if (!data.detail){
          localStorage.setItem('access', data.access)
          localStorage.setItem('refresh', data.refresh)
          navigate('/')
        }
    })
  }

  return (
    <>
      {
        loggedIn ? (
          navigate('/')
        ) : (
          <div>
            <br />
            <form onSubmit={handleSubmit}>
              <input required type="text" name="username" placeholder='Username' minLength={5} value={username} onChange={(e) => setUsername(e.target.value)}/>
              <input required type="password" name="password" placeholder='Password' minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}/>
              <input type="submit" value='Submit'/>
            </form>
          </div>
        )
      }
    </>
    
  )
}

export default RegisterPage