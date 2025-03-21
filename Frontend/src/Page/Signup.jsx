import { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("⚠️ Passwords do not match!");
      return;
    }

    const res = await signup(name, email, username, password);

    if (res.error) {
      setMessage({ text: ` ${res.error}`, type: "error" });
    } else {
      setMessage({
        text: "Signup successful! Redirecting to login...",
        type: "success",
      });
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-4xl font-bold text-center text-orange-600 mb-6">
          Create an Account
        </h2>
        {message && (
          <p
            className={`text-sm font-semibold text-center p-2 rounded transition ${
              message.type === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {message.text}
          </p>
        )}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-orange-600 rounded-md text-white font-semibold hover:bg-orange-800 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-red-400 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
