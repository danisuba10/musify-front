import React, { useContext } from "react";
import { useState } from "react";

import "../../styles/auth/Auth.css";
import { AuthContext } from "./AuthProvider";

const RegisterForm = ({ toLogin, close }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword && userName !== "") {
      try {
        await register(email, password, userName);
        close();
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match!");
      } else if (userName === "") {
        setErrorMessage("Username is required!");
      }
    }
  };

  return (
    <>
      <h2 className="login-title">Register</h2>
      <form className="form-label" onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="error-popup border-2 border-orange-500 rounded-md pl-2 pr-2">
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            value={userName}
            onChange={(u) => setUserName(u.target.value)}
            className="form-input"
            placeholder="Enter your username"
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(p) => setPassword(p.target.value)}
            className="form-input"
            placeholder="Enter your password"
          ></input>
        </div>
        <div className="form-group">
          <label className="form-label">Repeat password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(rp) => setConfirmPassword(rp.target.value)}
            className="form-input"
            placeholder="Enter your password"
          ></input>
        </div>
        <div className="auth-buttons">
          <button type="submit" className="login-button">
            Register
          </button>
          <p className="form-label flex flex-row items-center justify-center w-[100%] gap-3">
            Already have an account?
            <button
              type="button"
              onClick={toLogin}
              className="text-green-500 text-lg font-bold hover:text-green-600 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
