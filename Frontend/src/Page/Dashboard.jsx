import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Modal from "../components/Modal"; // Import Modal
import Header from "../components/Header";

const Dashboard = () => {
  const [uiData, setUiData] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null); // Store selected anime for modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      console.log("CALLED!");

      try {
        const res = await fetch("http://localhost:5000/ui", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.status !== 200) {
          localStorage.removeItem("token");
          navigate("/");
        } else {
          setUiData(data);
        }
      } catch (error) {
        console.error("Error fetching UI:", error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="bg-black text-white min-h-screen">
      {uiData ? (
        <>
          <Header UI={uiData} />

          {uiData.sections.map((section, index) =>
            section.type === "banner" ? (
              <Banner key={index} data={section.content[0]} />
            ) : (
              <Carousel
                key={index}
                title={section.title}
                items={section.items}
                onCardClick={(anime) => setSelectedAnime(anime)} // Pass click handler
              />
            )
          )}

          {/* Show Modal if an anime is selected */}
          {selectedAnime && (
            <Modal
              anime={selectedAnime}
              onClose={() => setSelectedAnime(null)}
            />
          )}
        </>
      ) : (
        <p className="text-center mt-10">Loading UI...</p>
      )}
    </div>
  );
};

export default Dashboard;
