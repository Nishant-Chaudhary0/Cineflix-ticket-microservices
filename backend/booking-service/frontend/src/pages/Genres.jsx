import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

const availableGenres = ["Action", "Comedy", "Adventure", "Sci-Fi"];

const Genres = () => {
  const [genre, setGenre] = useState("Action");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:3002/api/v1/movies/get-movie-by-genre/${genre}`
        );
        setMovies(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Could not load movies for this genre."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [genre]);

  return (
    <div className="min-h-screen bg-[#0B0E1A] py-10 text-[#E7E9F5]">
      <div className="mx-auto max-w-6xl px-4">
        <span className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
          Pick a Reel
        </span>
        <h1 className="mb-6 mt-1 text-3xl font-bold">Browse by Genre</h1>

        <div className="mb-8 flex flex-wrap gap-3">
          {availableGenres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              className={`rounded-md px-5 py-2 font-mono-tix text-xs font-bold uppercase tracking-widest transition ${
                genre === g
                  ? "bg-[#7C5CFC] text-white shadow-[0_0_14px_rgba(124,92,252,0.45)]"
                  : "border border-[#2E3550] bg-[#141827] text-[#8A90A8] hover:border-[#7C5CFC] hover:text-[#E7E9F5]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="font-mono-tix text-sm text-[#8A90A8]">
            Showing movies for <span className="text-[#22D3EE]">{genre}</span>
          </p>
        </div>

        {loading && <p className="font-mono-tix text-sm text-[#8A90A8]">Loading movies…</p>}

        {error && (
          <div className="rounded-xl border border-[#FB7185]/40 bg-[#FB7185]/10 p-4 text-[#FB7185]">
            {error}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="font-mono-tix text-sm text-[#8A90A8]">No movies found for this genre.</p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={{ ...movie, title: movie.title || movie.name }}
              onClick={() => navigate(`/show/${movie._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Genres;
