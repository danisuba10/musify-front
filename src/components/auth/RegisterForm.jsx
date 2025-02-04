import React from "react";
import { useState } from "react";

import "../../styles/auth/Auth.css";

const RegisterForm = ({ toLogin }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <h2 className="login-title">Register</h2>
      <form className="login-form">
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
