import React from 'react'
import { useNavigate } from 'react-router-dom';

function ShowCard({ show }) {
  const navigate = useNavigate();
  const id = show._id;

  return (
    <div className="mm-tear w-full rounded-2xl border border-[#262B42] bg-[#141827] p-5">
      {/* Date */}
      <div className="mb-4 flex items-baseline gap-2 border-b border-[#262B42] pb-3">
        <p className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">{show.showDay}</p>
        <h2 className="text-lg font-bold text-[#E7E9F5]">{show.showDate}</h2>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Theatre */}
        <h3 className="text-[15px] font-semibold text-[#C7CBE0]">
          {show.theatre.theatreName}
        </h3>

        {/* Time & Button */}
        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-[#2E3550] bg-[#0E1220] px-4 py-2 font-mono-tix text-sm font-semibold text-[#22D3EE]">
            {show.showTime}
          </div>

          <button
            onClick={() => navigate(`/new-booking/${id}`)}
            className="rounded-lg bg-[#7C5CFC] px-6 py-2.5 font-mono-tix text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#8F72FF]"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowCard;
