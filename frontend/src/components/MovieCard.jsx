import React from 'react'

function MovieCard({ movie, onClick }) {
  return (
    <div
      className="w-[200px] rounded-xl border border-gray-200 overflow-hidden bg-white cursor-pointer hover:-translate-y-1 transition-transform duration-200"
      onClick={onClick}
    >
      <img
        src={movie.image}
        alt={movie.name}
        className="w-full h-[250px] object-cover block"
      />

      <div className="px-3 pt-2.5 pb-3">
        <h2 className="m-0 mb-1 text-[15px] font-medium whitespace-nowrap overflow-hidden text-ellipsis text-gray-900">
          {movie.title}
        </h2>

        <p className="text-xs text-gray-400 mb-2.5">
          {movie.certification} | {movie.language}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
            <span className="text-amber-400 text-base">★</span>
            {movie.rating}
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-full px-4 py-1.5 text-[13px] font-medium cursor-pointer transition-colors duration-150">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;