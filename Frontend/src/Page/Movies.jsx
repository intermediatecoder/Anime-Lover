import React, { useEffect, useState } from "react";
import Header from "../components/Header";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [UI, setUI] = useState({ header: { logo: "", menu: [] } });

  useEffect(() => {
    fetch("http://localhost:5000/movies")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.movies);
        if (data.UI) setUI(data.UI);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <>
      <Header UI={UI} />
      <div className="p-4 bg-black text-white min-h-screen">
        <h1 className="text-3xl font-bold text-center mb-6">
          Popular Anime Movies
        </h1>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 p-4 rounded-lg shadow-md"
            >
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full h-64 object-cover rounded-md"
              />
              <h2 className="text-xl font-bold mt-2">{movie.title}</h2>
              <p className="text-gray-400">
                {movie.genre} | {movie.releaseYear}
              </p>
              <p className="mt-2">{movie.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Movies;
