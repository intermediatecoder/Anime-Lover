import { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login(username, password);

    if (res.error) {
      setError(res.error);
    } else {
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h2 className="text-3xl mb-6">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="bg-gray-800 p-6 rounded" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full bg-gray-700 text-white"
        />
        <button type="submit" className="bg-red-600 p-2 w-full">
          Login
        </button>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <a href="/" className="text-blue-400">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
