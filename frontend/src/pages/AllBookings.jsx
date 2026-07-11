import axios from "axios";
import React, { useEffect, useState } from "react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("accessToken");
        console.log(token);
        const response = await axios.get(
          "http://localhost:3002/api/v1/bookings/get-all-bookings-by-id",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookings(response.data);
      } catch (err) {
        console.log(err.message)
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusStyle = (status) =>
    status === "success"
      ? "bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30"
      : status === "pending"
      ? "bg-[#F5B942]/10 text-[#F5B942] border border-[#F5B942]/30"
      : "bg-[#FB7185]/10 text-[#FB7185] border border-[#FB7185]/30";

  // booking.movie / booking.show come back populated (objects) if the API
  // uses .populate(); fall back to a short ID snippet if it doesn't.
  const isObj = (v) => v && typeof v === "object";

  const getMovieInfo = (movie) =>
    isObj(movie)
      ? {
          name: movie.name || movie.title || "Untitled",
          image: movie.image,
          language: movie.language,
        }
      : { name: `Movie #${String(movie).slice(-6)}`, image: null, language: null };

  const getShowInfo = (show) =>
    isObj(show)
      ? {
          theatre: show.theatre?.theatreName,
          date: show.showDate,
          day: show.showDay,
          time: show.showTime,
        }
      : { theatre: null, date: null, day: null, time: null };

  return (
    <div className="min-h-screen bg-[#0B0E1A] py-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-5xl px-4">
        <span className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
          Your Stubs
        </span>
        <h1 className="mb-6 mt-1 text-3xl font-bold">All Bookings</h1>

        {loading && <p className="font-mono-tix text-sm text-[#8A90A8]">Loading bookings…</p>}

        {error && (
          <div className="rounded-xl border border-[#FB7185]/40 bg-[#FB7185]/10 p-4 text-[#FB7185]">
            {error}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <p className="font-mono-tix text-sm text-[#8A90A8]">No bookings found.</p>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => {
              const movie = getMovieInfo(booking.movie);
              const show = getShowInfo(booking.show);

              return (
                <div
                  key={booking._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#262B42] bg-[#141827] sm:flex-row"
                >
                  {/* Poster */}
                  <div className="relative h-40 w-full flex-shrink-0 sm:h-auto sm:w-32">
                    {movie.image ? (
                      <img
                        src={movie.image}
                        alt={movie.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#0E1220] font-mono-tix text-[10px] uppercase tracking-widest text-[#3E4358]">
                        No Poster
                      </div>
                    )}
                  </div>

                  {/* Perforated divider between poster and stub body */}
                  <div className="hidden w-0 border-l-2 border-dashed border-[#2E3550] sm:block" />
                  <div className="border-t-2 border-dashed border-[#2E3550] sm:hidden" />

                  {/* Stub body */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-[#E7E9F5]">{movie.name}</h2>
                        <p className="mt-0.5 font-mono-tix text-xs uppercase tracking-wide text-[#5C6280]">
                          {movie.language || "—"}
                        </p>

                        {(show.theatre || show.date || show.time) && (
                          <p className="mt-2 font-mono-tix text-xs text-[#8A90A8]">
                            {show.theatre && <span>{show.theatre} · </span>}
                            {show.day && <span>{show.day} </span>}
                            {show.date && <span>{show.date}</span>}
                            {show.time && <span> · {show.time}</span>}
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex shrink-0 rounded-full px-3 py-1 font-mono-tix text-xs font-semibold uppercase tracking-wide ${statusStyle(
                          booking.paymentstatus
                        )}`}
                      >
                        {booking.paymentstatus}
                      </span>
                    </div>

                    <div className="mm-tear mt-4 flex flex-wrap items-center justify-between gap-3 pt-4">
                      <div>
                        <p className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">Seats</p>
                        <p className="font-mono-tix text-sm text-[#E7E9F5]">
                          {booking.seats?.join(", ") || "—"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">Total</p>
                        <p className="font-mono-tix text-sm font-bold text-[#F5B942]">₹{booking.totalPrice}</p>
                      </div>
                      <div className="w-full font-mono-tix text-[11px] text-[#5C6280] sm:w-auto">
                        Booked {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBookings;