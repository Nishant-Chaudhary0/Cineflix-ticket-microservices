import axios from "axios";
import React, { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { useNavigate } from "react-router-dom";

const AllMovies = () => {
  const [movies, setMovie] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3002/api/v1/movies/get-all-movies"
        );

        setMovie(res.data);
      } catch (error) {
        console.log("Error fetching all movies", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0E1A] text-[#E7E9F5]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="font-mono-tix text-xs uppercase tracking-widest text-[#5C6280]">
            Full Lineup
          </span>
          <h1 className="mt-1 text-3xl font-bold">All Movies</h1>
        </div>

        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onClick={() => navigate(`/show/${movie._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllMovies;
