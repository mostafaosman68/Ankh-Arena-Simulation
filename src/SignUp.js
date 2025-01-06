import React, { useState } from "react";
import { useAuth } from './components/AuthContext'; 

import { useNavigate } from "react-router-dom";
import axios from "axios";
// styling
import "./Contanier.css";

function validateForm1(name, email, password, confirmPassword) {
  if (!name.trim()) {
    return "Name is required.";
  }
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return "Invalid email address.";
  }
  if (!password) {
    return "Password is required.";
  }
  if (!/^[a-zA-Z0-9!@#$%^&*()_+]{8,}$/.test(password)) {
    return "Password must be at least 8 characters.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return null; // No errors
}

const SignUp = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm1(name, email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      setSuccess("");
    } else {
      try {
        const response = await axios.post("http://localhost:5000/api/Signup", {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setSuccess(response.data.message);
          setError("");
          alert("Account created successfully!");
          navigate("/");
        } else {
          setError(response.data.message);
          setSuccess("");
        }
      } catch (err) {
        console.error("Error signing up:", err);
        setError("An error occurred. Please try again.");
        setSuccess("");
      }
    }
  };

  return (
    <div className="form-comp cfb">
      <h1>Create an Account!</h1>
      <form className="sign-up-form cfb" onSubmit={handleSubmit}>
        <label>
          Name:
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Email:
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm Password:
          <br />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Sign Up!</button>
      </form>
    </div>
  );
};

export default SignUp;
