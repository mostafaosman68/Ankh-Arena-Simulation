import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import './Contanier.css';

function validateForm21(email1, password1) {
  if (!email1.trim()) {
    return "Email is required.";
  }
  if (!/\S+@\S+\.\S+/.test(email1)) {
    return "Invalid email address.";
  }
  if (!password1.trim()) {
    return "Password is required.";
  }
  if (!/^[a-zA-Z0-9!@#$%^&*()_+]{8,}$/.test(password1)) {
    return "Password must be at least 8 characters with valid characters only.";
  }
  return null; // No errors
}

const SignIn = () => {
  const navigate = useNavigate();

  const [password1, setPassword] = useState('');
  const [email1, setEmail] = useState('');
  const [error, setErrors] = useState('');
  const [apiError, setApiError] = useState('');


  const handleSignin = async (e) => {
    e.preventDefault();
    const validationError = validateForm21(email1, password1);

    if (validationError) {
      setErrors(validationError);
      return;
    }

    try {
      // API request to validate credentials
      const response = await fetch('http://localhost:5000/api/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email1, password1 })
      });

      const data = await response.json();

      if (data.success) {
        setErrors('');
        setApiError('');
        alert('Login successful!');
        navigate('/homepage'); // Navigate to the home/dashboard page
      } else {
        setApiError(data.message || 'Invalid credentials.');
      }
    } catch (error) {
      setApiError('Something went wrong. Please try again.');
      console.error('Login API error:', error);
    }
  };


  return (
    <div className="form-comps cfb">
      <h1>Sign In!</h1>
      <form className="sign-in-form cfb" onSubmit={handleSignin}>
        <label>
          Email:
          <br />
          <input
            placeholder='Enter your Email'
            type="email"
            value={email1}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <br />
          <input
            placeholder='Enter your Password'
            type="password"
            value={password1}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
        <button type="submit">Sign In!</button>
      </form>
    </div>
  );
};

export default SignIn;
