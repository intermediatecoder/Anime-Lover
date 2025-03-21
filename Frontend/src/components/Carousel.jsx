import { useState, useEffect } from "react";

const Carousel = ({ title, items = [], onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 8; // Adjust as needed

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? items.length - itemsPerPage : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerPage >= items.length ? 0 : prev + 1
    );
  };

  return (
    <div className="p-6 relative w-full mx-auto">
      {/* Title */}
      <h2 className="text-3xl font-extrabold mb-6 text-white">{title}</h2>

      <div className="relative flex items-center group">
        {/* Left Navigation Button */}
        <button
          onClick={prevSlide}
          className="absolute left-2 z-20 bg-gray-900 hover:bg-gray-800 text-white text-2xl p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          &#10094;
        </button>

        {/* Carousel Items */}
        <div className="flex space-x-6 overflow-hidden w-full">
          {items.length > 0 ? (
            items
              .slice(currentIndex, currentIndex + itemsPerPage)
              .concat(
                items.slice(
                  0,
                  Math.max(0, currentIndex + itemsPerPage - items.length)
                )
              ) // Wrap items for infinite loop
              .map((anime, index) => (
                <div
                  key={index}
                  className="w-48 cursor-pointer transform hover:scale-110 transition duration-300"
                  onClick={() => onCardClick(anime)}
                >
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  <p className="text-center text-lg mt-2 font-medium text-white">
                    {anime.title}
                  </p>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              No data available
            </p>
          )}
        </div>

        {/* Right Navigation Button */}
        <button
          onClick={nextSlide}
          className="absolute right-2 z-20 bg-gray-900 hover:bg-gray-800 text-white text-2xl p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Carousel;
