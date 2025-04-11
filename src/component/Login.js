import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Using centralized Axios instance

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/api/user/login", { email, password });

      if (data?.token && data?.userId) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("authToken", data.token);
        alert("Login successful!");
        navigate("/userprofile");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
