const Banner = ({ data }) => {
  if (!data) return null;

  return (
    <div className="relative w-full h-[500px]">
      <img
        src={data.image || "https://via.placeholder.com/1280x720"} // Fallback image
        alt={data.title || "Banner"}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-10 left-10 text-white">
        <h2 className="text-3xl font-bold">{data.title}</h2>
        <p className="text-lg">{data.description}</p>
      </div>
    </div>
  );
};

export default Banner;
