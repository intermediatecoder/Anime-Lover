import { motion } from "framer-motion";

const Modal = ({ anime, onClose }) => {
  if (!anime) return null;

  const characterImage =
    anime.characters?.[0]?.image || "https://via.placeholder.com/150";

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-80 backdrop-blur-lg">
      {/* Full-Screen Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-lg"
        style={{
          backgroundImage: `url(${characterImage})`,
          opacity: 0.2,
        }}
      />

      {/* Motion Container */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative bg-gray-900 bg-opacity-95 text-white p-8 rounded-lg max-w-4xl w-full shadow-2xl border border-gray-700 flex flex-col lg:flex-row"
      >
        {/* Left Side - Anime Cover & Status */}
        <div className="lg:w-1/3 flex flex-col items-center text-center">
          <img
            src={anime.image}
            alt={anime.title}
            className="w-48 h-64 object-cover rounded-lg shadow-lg border-4 border-red-500 transition-transform duration-300 hover:scale-105"
          />
          <h2 className="text-3xl font-bold text-red-500 mt-4">
            {anime.title}
          </h2>
          <p className="text-gray-400 text-sm">
            Studio: {anime.studio || "N/A"}
          </p>
          <p className="text-gray-400 text-sm">
            Status:{" "}
            <span
              className={`px-2 py-1 rounded-lg text-white ${
                anime.status === "Ongoing" ? "bg-green-600" : "bg-gray-600"
              }`}
            >
              {anime.status}
            </span>
          </p>
        </div>

        {/* Right Side - Details */}
        <div className="lg:w-2/3 lg:pl-6 mt-6 lg:mt-0">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl font-bold text-gray-400 hover:text-white transition duration-300"
          >
            &times;
          </button>

          {/* Anime Description */}
          <p className="text-sm text-gray-300">
            {anime.description || "No description available."}
          </p>

          {/* Grid Layout for Anime Details */}
          <div className="grid grid-cols-2 gap-4 mt-6 text-center">
            <p>
              <strong className="text-red-400">Genres:</strong>{" "}
              {anime.genres?.join(", ") || "N/A"}
            </p>
            <p>
              <strong className="text-red-400">Episodes:</strong>{" "}
              {anime.episodes ?? "Unknown"}
            </p>
            <p>
              <strong className="text-red-400">Release Year:</strong>{" "}
              {anime.release_year || "N/A"}
            </p>
            <p>
              <strong className="text-red-400">Rating:</strong> ⭐{" "}
              {anime.rating || "N/A"}
            </p>
            <p>
              <strong className="text-red-400">Streaming On:</strong>{" "}
              {anime.streaming_platform || "N/A"}
            </p>
          </div>

          {/* Quote Section */}
          {anime.quote && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 italic text-center text-yellow-300 text-lg"
            >
              "{anime.quote}"
            </motion.p>
          )}

          {/* Character Section */}
          {anime.characters && anime.characters.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-red-400">Characters</h3>
              <div className="flex overflow-x-auto mt-2 space-x-4">
                {anime.characters.map((char, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-600"
                    />
                    <p className="text-sm text-gray-300 mt-1">{char.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trailer Button */}
          {anime.trailer && (
            <div className="flex justify-center mt-6">
              <a
                href={anime.trailer}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-300"
              >
                🎬 Watch Trailer
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
