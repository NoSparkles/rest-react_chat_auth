import React, { useEffect, useState } from 'react'

const useValidate = () => {
  const [loggedIn, setLoggedIn] = useState(undefined)
  let refreshIntervalId = null

  useEffect(() => {
    validateToken()
  }, [])

  useEffect(() => {
    if (loggedIn === false){
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      clearInterval(refreshIntervalId)
      refreshIntervalId = null
    }
  }, [loggedIn])

  const validateToken = () => {
    let endpoint = 'http://localhost:8000/api/token/verify/'
    let accessToken = localStorage.getItem('access')
    if (accessToken === null || accessToken === ''){
      setLoggedIn(false)
      return
    }
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token: accessToken})
    }
    fetch(endpoint, options)
    .then(response=>response.json())
    .then(data=>{
      if (data.code === 'token_not_valid'){
        refreshToken()
      }
      else{
        setLoggedIn(true)
        refreshIntervalId = setInterval(refreshToken, 1800000)
      }
    })
  }

  const refreshToken = () => {
    let endpoint = 'http://localhost:8000/api/token/refresh/'
    let Token = localStorage.getItem('refresh')
    if (Token === null || Token === ''){
      setLoggedIn(false)
      return
    }
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({refresh: Token})
    }
    fetch(endpoint, options)
    .then(response=>response.json())
    .catch(err=>console.log(err))
    .then(data=>{
      if (data.code === 'token_not_valid'){
        alert('Your session has expired. Please log in again.')
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        setLoggedIn(false)
        clearInterval(refreshIntervalId)
        refreshIntervalId = null
      }
      else{
        localStorage.setItem('access', data.access)
        setLoggedIn(true)
      }
    })
  }

  return [loggedIn, setLoggedIn]
}

export default useValidate