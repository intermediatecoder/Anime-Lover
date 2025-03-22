import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import Modal from "../components/Modal";
import Header from "../components/Header";

const Dashboard = () => {
  const [uiData, setUiData] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

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

  useEffect(() => {
    if (!uiData) return;

    const bannerSection = uiData.sections.find(
      (section) => section.type === "banner"
    );

    if (bannerSection) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) =>
          prevIndex === bannerSection.content.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [uiData]);

  return (
    <div className="bg-black text-white min-h-screen">
      {uiData ? (
        <>
          <Header UI={uiData} />

          {uiData.sections.map((section, index) =>
            section.type === "banner" ? (
              <Banner
                key={index}
                data={section.content[currentBannerIndex]} // Auto-sliding banner
              />
            ) : (
              <Carousel
                key={index}
                title={section.title}
                items={section.items}
                onCardClick={(anime) => {
                  setSelectedAnime(anime);
                }}
              />
            )
          )}

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
