import React, { useState } from 'react'

const MovieDetail = ({ movie }) => {
  const [posterError, setPosterError] = useState(false)
  const bgImage = movie.backdrop || movie.image

  return (
    <div className="relative w-full min-h-[480px] bg-[#0B0E1A] text-white overflow-hidden">
      {/* Blurred ambient background */}
      {bgImage && (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      {/* Darkening overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(11,14,26,0.9) 0%, rgba(11,14,26,0.75) 35%, rgba(11,14,26,0.5) 60%, rgba(11,14,26,0.3) 100%)',
        }}
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
          {!posterError && movie.image ? (
            <img
              src={movie.image}
              alt={movie.name}
              loading="lazy"
              decoding="async"
              onError={() => setPosterError(true)}
              className="relative w-64 aspect-[2/3] rounded-xl border border-[#2E3550] object-cover shadow-2xl md:w-80"
            />
          ) : (
            <div className="relative flex w-64 aspect-[2/3] items-center justify-center rounded-xl border border-[#2E3550] bg-[#141827] text-sm text-[#5C6280] md:w-80">
              No image available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetail