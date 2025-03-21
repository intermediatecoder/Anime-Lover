export const fetchAnimeById = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/anime/${id}`);
    if (!response.ok) throw new Error("Anime not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching anime:", error);
    return null; // Return null if error
  }
};
