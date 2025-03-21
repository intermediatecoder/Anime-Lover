import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Backend URL

// 🔵 **Sign Up API**
export const signup = async (name, email, username, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/signup`, {
      name,
      email,
      username,
      password,
    });
    return res.data;
  } catch (err) {
    return { error: "Signup failed! Try again." };
  }
};

// 🔴 **Login API**
export const login = async (username, password) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });
    localStorage.setItem("token", res.data.token); // Store JWT token
    return res.data;
  } catch (err) {
    return { error: err.response?.data?.error || "Invalid credentials" };
  }
};

// 🎭 **Fetch Server-Driven UI (SDUI)**
export const fetchUI = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { error: "Not authenticated" };

    const res = await axios.get(`${API_BASE_URL}/ui`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return { error: "Failed to fetch UI data" };
  }
};

// 🚪 **Logout**
export const logout = () => {
  localStorage.removeItem("token");
};
