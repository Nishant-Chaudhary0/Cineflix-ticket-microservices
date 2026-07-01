import React, { useEffect, useState } from 'react'
import MovieDetail from '../components/movieDetail'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ShowCard from '../components/ShowCard.jsx';

const Show = () => {
  const[movie, setMovie] = useState([]);
  const[showData, setShow] = useState([]);
  const {id} = useParams()
  useEffect(() => {
   async function getMovie(){
    try {
      const [movieApi, showApi] = await Promise.all([
        axios.get(`http://localhost:3002/api/v1/movies/get-movie-by-id/${id}`),
        axios.get(`http://localhost:3002/api/v1/show/get-show-by-movie/${id}`)
      ])
      setMovie(movieApi.data);
      console.log(showApi.data);
      setShow(showApi.data);
    } catch (error) {
      console.log("error fetching movie",error);
      toast.error(error.response);
    }
   }
   getMovie();
  },[id])
  return (
    <div className="min-h-screen bg-gray-50">
      <MovieDetail movie={movie}/>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">
          Available Shows
        </h2>

        <div className="flex flex-col gap-3 sm:gap-4">
          {
            showData.map((showData) => (
              <ShowCard key={showData._id} show={showData}/>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Show;