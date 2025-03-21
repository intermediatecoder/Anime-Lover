import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/anime/${id}`)
      .then((res) => res.json())
      .then((data) => setAnime(data))
      .catch((err) => console.error("Error fetching anime details:", err));
  }, [id]);

  if (!anime) return <div className="text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold">{anime.title}</h1>
      <img
        src={anime.characters[0]?.image}
        alt={anime.title}
        className="w-60 mt-4"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
      />

      <p className="mt-2">{anime.description}</p>
      <p className="mt-2">
        <strong>Genre:</strong> {anime.genres.join(", ")}
      </p>
      <p className="mt-2">
        <strong>Episodes:</strong> {anime.episodes}
      </p>
      <p className="mt-2">
        <strong>Studio:</strong> {anime.studio}
      </p>
      <p className="mt-2">
        <strong>Quote:</strong> "{anime.quote}"
      </p>
    </div>
  );
};

export default AnimeDetails;
