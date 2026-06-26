import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { Route , Routes,  BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Genres from './pages/Genres'
import AllMovies from './pages/AllMovies'
import AllBookings from './pages/AllBookings'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/home' element={<Home/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/genres' element={<Genres/>}/>
      <Route path='/all-movies' element={<AllMovies/>}/>
      <Route path='/all-bookings' element={<AllBookings/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
