import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await API.post("/register", {
        email,
        password,
      });

      if (response.status === 201) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        setError(
          response.data.message || "Failed to register. Please try again."
        );
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Failed to register. Please try again."
      );
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
