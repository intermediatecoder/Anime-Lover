import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import Dashboard from "./Page/Dashboard";
import AnimeDetails from "./Page/AnimeDetails";
import NewsPopular from "./Page/NewPopular";
import Movies from "./Page/Movies";

const UI = {
  header: {
    logo: "http://localhost:5000/public/temp-logo.png",
    menu: ["Home", "Movies", "New & Popular"],
  },
};

{
  /*   */
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<AnimeDetails />} />
        <Route path="/news-popular" element={<NewsPopular UI={UI} />} />
        <Route path="/movies" element={<Movies UI={UI} />} />
      </Routes>
    </Router>
  );
}

export default App;
