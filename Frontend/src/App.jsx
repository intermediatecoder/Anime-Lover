import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import Dashboard from "./Page/Dashboard";
import AnimeDetails from "./Page/AnimeDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<AnimeDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
