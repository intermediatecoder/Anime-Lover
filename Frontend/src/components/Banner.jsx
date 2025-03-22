import React from "react";

const Banner = ({ data }) => {
  if (!data || typeof data !== "object") {
    return <p className="text-center text-white">No banner available.</p>;
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <img
        src={data.image || "https://via.placeholder.com/1280x720"}
        alt={data.title || "Banner"}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-10 left-10 text-white bg-black bg-opacity-50 p-4 rounded-md">
        <h2 className="text-3xl font-bold">{data.title}</h2>
        <p className="text-lg">{data.description}</p>
      </div>
    </div>
  );
};

export default Banner;
