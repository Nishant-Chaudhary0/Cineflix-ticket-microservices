import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          "http://localhost:3002/api/v1/movies/get-all-movies"
        );
        setMovies(response.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Unable to load movies."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E1A] text-[#E7E9F5]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Marquee hero */}
        <section className="mb-14 overflow-hidden rounded-2xl border border-[#262B42] bg-[#141827]">
          <div className="flex flex-col items-center gap-6 px-8 py-14 text-center">
            <span className="mm-glow-bar w-2/3 max-w-md" />
            <div>
              <span className="font-mono-tix text-xs uppercase tracking-[0.4em] text-[#8A90A8]">
                Booking Now Open
              </span>
              <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">
                Welcome to <span className="text-[#22D3EE]">CineFlix</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-[#8A90A8] sm:text-base">
                Discover the latest movies, browse by genre, and book your seats instantly —
                no queues, just the show.
              </p>
            </div>
            <button
              onClick={() => navigate("/all-movies")}
              className="rounded-md bg-[#7C5CFC] px-7 py-3 font-mono-tix text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(124,92,252,0.4)] transition hover:bg-[#8F72FF]"
            >
              Browse Movies
            </button>
          </div>
        </section>

        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
              On the Marquee
            </span>
            <h2 className="mt-1 text-2xl font-bold text-[#E7E9F5]">Trending Movies</h2>
          </div>
        </div>

        {loading && (
          <p className="font-mono-tix text-sm text-[#8A90A8]">Loading movies…</p>
        )}

        {error && (
          <div className="rounded-xl border border-[#FB7185]/40 bg-[#FB7185]/10 p-4 text-[#FB7185]">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="font-mono-tix text-sm text-[#8A90A8]">No movies found.</p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={{
                ...movie,
                title: movie.title || movie.name,
                certification: movie.certification || "PG",
              }}
              onClick={() => navigate(`/show/${movie._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
