import React from 'react'


const MovieDetail = ({ movie }) => {
  
  return (
    <div
      className="relative w-full min-h-[480px] bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${movie.image || movie.image})` }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto px-10 py-16 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {movie.name}
          </h1>

          <p className="mt-4 text-gray-200 text-sm md:text-base">
            {/* {movie.certification && <span>{movie.certification} | </span>} */}
            {movie.language && <span>{movie.language} | </span>}
            {movie.duration}
          </p>

          <p className="mt-6 text-gray-200 text-sm md:text-base leading-relaxed">
            {movie.description}
          </p>

          {movie.genre && (
            <div className="mt-6 flex flex-wrap gap-3">
              {(Array.isArray(movie.genre) ? movie.genre : movie.genre.split(',')).map((g, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          )}

          <p className="mt-6 text-sm text-gray-300">
            Released {movie.releaseDate}
          </p>

          <button className="mt-6 bg-white text-black font-semibold px-6 py-3 rounded-md hover:bg-gray-200 transition-colors" onClick={() => handleClick()}>
            Book Tickets
          </button>
        </div>

        <div className="flex-shrink-0 relative">
          <img
            src={movie.image}
            alt={movie.name}
            className="w-64 md:w-80 rounded-xl shadow-2xl object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-6 h-6 ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail