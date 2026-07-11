import React from 'react'


const MovieDetail = ({ movie }) => {

  return (
    <div
      className="relative w-full min-h-[480px] bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${movie.image || movie.image})` }}
    >
      <div className="absolute inset-0 bg-[#0B0E1A]/85" />
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: 'linear-gradient(180deg, rgba(11,14,26,0.2) 0%, rgba(11,14,26,0.95) 100%)' }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 px-6 py-16 lg:flex-row lg:items-start lg:px-10">
        <div className="max-w-2xl">
          <span className="font-mono-tix text-xs uppercase tracking-[0.35em] text-[#22D3EE]">
            Now Screening
          </span>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl">
            {movie.name}
          </h1>

          <p className="mt-4 font-mono-tix text-sm text-[#8A90A8] md:text-base">
            {movie.language && <span>{movie.language} · </span>}
            {movie.duration}
          </p>

          <p className="mt-6 text-sm leading-relaxed text-[#C7CBE0] md:text-base">
            {movie.description}
          </p>

          {movie.genre && (
            <div className="mt-6 flex flex-wrap gap-2">
              {(Array.isArray(movie.genre) ? movie.genre : movie.genre.split(',')).map((g, i) => (
                <span
                  key={i}
                  className="rounded-md border border-[#2E3550] bg-[#141827] px-3.5 py-1.5 font-mono-tix text-xs uppercase tracking-wide text-[#C7CBE0]"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          )}

          <p className="mt-6 font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
            Released {movie.releaseDate}
          </p>

          <button className="mt-6 rounded-md bg-[#7C5CFC] px-7 py-3 font-mono-tix text-sm font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(124,92,252,0.4)] transition hover:bg-[#8F72FF]">
            Book Tickets
          </button>
        </div>

        <div className="relative flex-shrink-0">
          <div className="absolute -inset-2 rounded-xl bg-[#7C5CFC]/20 blur-2xl" />
          <img
            src={movie.image}
            alt={movie.name}
            className="relative w-64 rounded-xl border border-[#2E3550] object-cover shadow-2xl md:w-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="ml-1 h-6 w-6"
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
