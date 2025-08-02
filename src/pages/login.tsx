import { useState } from "react";
import { fetchData } from "../utils/fetch";
import { API } from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetchData({
        url: API.getToken, // Update with your actual login endpoint
        method: "POST",
        body: {
          email: username,
          password: password,
        },
      });

      if (response?.data?.access) {
        localStorage.setItem("token", response.data.access);
        window.location.href = "/"; // Redirect to home
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen min-w-screen flex-col">
      <div className="w-[450px] h-[300px] bg-[#d8d8d85b] border-black border flex flex-col justify-between items-center py-6 rounded-xl backdrop-blur-md bg-opacity-20 shadow-2xl">
        <h1 className="font-bold text-2xl">Login</h1>
        <input
          className="w-[300px] h-[40px] border-black border rounded-md p-2"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-[300px] h-[40px] border-black border rounded-md p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          className="w-[300px] h-[40px] bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
