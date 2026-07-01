import React from 'react'

function ShowCard({ show }) {

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {/* Date */}
      <div className="mb-4 border-b border-gray-100 pb-3">
        <p className="text-sm font-medium text-gray-500">{show.showDay}</p>
        <h2 className="text-xl font-bold text-gray-900">{show.showDate}</h2>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Theatre */}
        <h3 className="text-[15px] font-semibold text-gray-900">
          {show.theatre.theatreName}
        </h3>

        {/* Time & Button */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
            {show.showTime}
          </div>

          <button
            // onClick={onBook}
            className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowCard;