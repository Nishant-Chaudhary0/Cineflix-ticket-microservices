import React from 'react'

function MovieCard({ movie, onClick }) {
  return (
    <div
      className="group w-[200px] cursor-pointer overflow-hidden rounded-xl border border-[#262B42] bg-[#141827] transition-all duration-200 hover:-translate-y-1 hover:border-[#7C5CFC] hover:shadow-[0_0_24px_rgba(124,92,252,0.25)]"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={movie.image}
          alt={movie.name}
          className="block h-[250px] w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0E1A] to-transparent" />
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-[#0B0E1A]/80 px-2 py-1 font-mono-tix text-[11px] font-semibold text-[#F5B942] backdrop-blur">
          ★ {movie.rating}
        </span>
      </div>

      <div className="px-3 pb-3 pt-2.5">
        <h2 className="m-0 mb-1 truncate text-[15px] font-semibold text-[#E7E9F5]">
          {movie.title}
        </h2>

        <p className="mb-3 font-mono-tix text-[11px] uppercase tracking-wide text-[#5C6280]">
          {movie.certification} · {movie.language}
        </p>

        <div className="mm-tear -mx-3 px-3 pt-3">
          <button className="w-full rounded-md bg-[#7C5CFC] py-1.5 font-mono-tix text-[12px] font-bold uppercase tracking-widest text-white transition-colors duration-150 hover:bg-[#8F72FF]">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
