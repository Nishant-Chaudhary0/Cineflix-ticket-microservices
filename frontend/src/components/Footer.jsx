import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-dashed border-[#262B42] bg-[#0B0E1A]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              {/* <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#7C5CFC] font-mono-tix text-sm font-bold text-[#0B0E1A]">
                C
              </span> */}
              <span className="font-mono-tix text-lg font-bold tracking-wide text-[#E7E9F5]">
                CINE<span className="text-[#22D3EE]">FLIX</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#8A90A8]">
              Your seat, reserved. Discover showtimes, pick your row and skip the box-office queue.
            </p>
          </div>

          <div>
            <h3 className="font-mono-tix text-xs font-bold uppercase tracking-widest text-[#5C6280]">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><NavLink to="/all-movies" className="text-[#8A90A8] hover:text-[#22D3EE] transition">All Movies</NavLink></li>
              <li><NavLink to="/genres" className="text-[#8A90A8] hover:text-[#22D3EE] transition">Genres</NavLink></li>
              <li><NavLink to="/all-bookings" className="text-[#8A90A8] hover:text-[#22D3EE] transition">My Bookings</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-tix text-xs font-bold uppercase tracking-widest text-[#5C6280]">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><NavLink to="/login" className="text-[#8A90A8] hover:text-[#22D3EE] transition">Login</NavLink></li>
              <li><NavLink to="/sign-up" className="text-[#8A90A8] hover:text-[#22D3EE] transition">Sign Up</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono-tix text-xs font-bold uppercase tracking-widest text-[#5C6280]">
              Showtime
            </h3>
            <p className="mt-4 text-sm text-[#8A90A8]">
              Doors open 30 minutes before every screening. Bring your ticket, we'll bring the popcorn.
            </p>
          </div>
        </div>

        <div className="mm-tear mt-10 flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
          <p className="font-mono-tix text-xs text-[#5C6280]">
            © {new Date().getFullYear()} CineFlix. All seats final.
          </p>
          <div className="mm-sprockets">
            <span /><span /><span /><span /><span /><span />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
