import React from 'react'
import MovieCard from '../components/MovieCard'

const Home = () => {
  return (
    <div>
      <MovieCard
        title="Avengers: Endgame"
        language="English"
        duration="3h 1m"
        genre="Action"
        rating="8.9"
        image="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600"
        onClick={() => alert("Movie Clicked!")}
      />
    </div>
  )
}

export default Home
