import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../../styles/auth/Auth.css";
import { useState } from "react";

const AuthOverlay = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-overlay">
      <div className="login-backdrop"></div>
      <div className={isLogin ? "login-container" : "register-container"}>
        <button onClick={onClose} className="login-close-button">
          ✕
        </button>
        {isLogin ? (
          <LoginForm toRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm toLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthOverlay;
