import { BrowserRouter, Routes, Route, Link} from 'react-router-dom'
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ChatPage from './components/ChatPage'
import ChatCreatePage from './components/ChatCreatePage'
import ChatJoinPage from './components/ChatJoinPage'
function App() {

  return (
    <>
      <BrowserRouter>
        <Link to=''>Go Home</Link>
        <Routes>
          <Route exact path='' Component={HomePage}></Route>
          <Route exact path='login/' Component={LoginPage}></Route>
          <Route exact path='register/' Component={RegisterPage}></Route>
          <Route exact path='chat-create/' Component={ChatCreatePage}></Route>
          <Route exact path='chat-join/' Component={ChatJoinPage}></Route>
          <Route exact path='chat/:id/' Component={ChatPage}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
