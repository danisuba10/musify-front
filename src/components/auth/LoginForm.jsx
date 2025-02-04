import React from "react";
import { useState } from "react";

import "../../styles/auth/Auth.css";

const LoginForm = ({ toRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h2 className="login-title">Login</h2>
      <form className="login-form">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(p) => setPassword(p.target.value)}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        <div className="auth-buttons">
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="form-label flex flex-row items-center justify-center w-[100%] gap-3">
            Don't have an account yet?
            {
              <button
                type="button"
                onClick={toRegister}
                className="text-green-500 text-lg font-bold hover:text-green-600 transition-colors"
              >
                Register
              </button>
            }
          </p>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
