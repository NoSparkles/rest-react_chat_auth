import React, { useEffect } from 'react'
import { Link, useResolvedPath } from 'react-router-dom'
import useValidate from '../useValidate'
import { useNavigate } from 'react-router-dom'
import useFetch from '../useFetch'

const HomePage = () => {
  const [loggedIn, setLoggedIn] = useValidate()
  let navigate = useNavigate()
  let [userData, userResponse,  userError, fetchUserData] = useFetch()

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
      if(userResponse.ok){
        console.log(userData)
      }
    }
  }, [userData])

  const handleLogout = () => {
    setLoggedIn(false)
  }

  return (
    <div>
      <br />
      {
        loggedIn ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <hr/>
            <Link to='chat-join/'>Join chat room</Link>
            <br />
            <Link to='chat-create/'>Create chat room</Link>
            <hr />
            <div className='rooms'>
              {
                userData ? (
                  userData.rooms.map((item, i) => (
                    <div key={i} className='room-link'>
                      <Link to={`/chat/${item.id}/`}>{`Room: ${item.id}`}</Link>
                    </div>
                  ))
                ) : (
                  <></>
                )
              }
              
            </div>
          </>
        ) : (
          <>
            <Link to='login/'>Login</Link>
            <br />
            <Link to='register/'>Register</Link>
            <hr/>
          </>
        )
      }
    </div>
  )
}

export default HomePage