import './App.css'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Genres from './pages/Genres'
import AllMovies from './pages/AllMovies'
import AllBookings from './pages/AllBookings'
import Show from './pages/Show'
import { Toaster } from 'react-hot-toast'
import NewBooking from './pages/NewBooking'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#141827',
            color: '#E7E9F5',
            border: '1px solid #262B42',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
          },
        }}
      />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-[#0B0E1A]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path='/' element={<Navigate to="/home" replace />} />
              <Route path='/home' element={<Home/>}/>
              <Route path='/sign-up' element={<SignUp/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/genres' element={<Genres/>}/>
              <Route path='/all-movies' element={<AllMovies/>}/>
              <Route path='/all-bookings' element={<AllBookings/>}/>
              <Route path='/show/:id' element={<Show/>}/>
              <Route path='/new-booking/:id' element={<NewBooking/>}/>
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
