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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        All Movies
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onClick={() => navigate(`/show/${movie._id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default AllMovies;