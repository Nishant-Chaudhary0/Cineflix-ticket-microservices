import React from 'react'

function MovieCard({ title, language, duration, genre, image, onClick }) {
  return (
    <div
      className="w-[280px] rounded-xl border border-[#e0e0e0] overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-1 bg-white"
      onClick={onClick}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-[200px] object-cover block"
        />

        <span className="absolute top-[10px] left-[10px] bg-black/65 text-white text-[12px] px-[10px] py-[3px] rounded-full">
          {genre}
        </span>
      </div>

      <div className="px-4 pt-[14px] pb-4">
        <h2 className="m-0 mb-[6px] text-[16px] whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h2>

        <div className="flex gap-[14px] text-[13px] text-[#666] mb-[14px]">
          <span>🌐 {language}</span>
          <span>🕐 {duration}</span>
        </div>

        <button className="w-full py-[9px] border border-[#1a73e8] bg-[#e8f0fe] text-[#1a73e8] rounded-lg text-[14px] font-medium cursor-pointer">
          Book Ticket
        </button>
      </div>
    </div>
  );
}

export default MovieCard;