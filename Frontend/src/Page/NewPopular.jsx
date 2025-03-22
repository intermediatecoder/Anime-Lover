import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const NewsPopular = ({ UI }) => {
  const [news, setNews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/news-popular");
        const data = await response.json();
        setNews(data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      <Header UI={UI} />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Latest News & Popular
        </h1>

        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-md">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-md mb-3"
                />
                <h2 className="text-xl font-semibold">{article.title}</h2>
                <p className="text-sm text-gray-300">{article.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center mt-10">Loading News & Popular Content...</p>
        )}
      </div>
    </div>
  );
};

export default NewsPopular;
