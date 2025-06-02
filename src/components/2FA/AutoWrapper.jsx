import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import TwoFactorVerification from "../2FA/TwoFactorVerification";
import { useTwoFactor } from "../Context/TwoFactorContext";

export const RequireAuth = ({ children, require2FA = false }) => {
  const { isAuthenticated, userInfo, logout, setToken } =
    useContext(AuthContext);
  const { set2FADisabled } = useTwoFactor();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const needs2FA =
    require2FA &&
    userInfo.TwoFactorEnabled === "true" &&
    userInfo.TwoFactorPending === "true";

  console.log("User Info:", userInfo);
  if (needs2FA) {
    if (!isModalOpen) setIsModalOpen(true);
    return (
      <div className="w-full h-full bg-black">
        <TwoFactorVerification
          isOpen={isModalOpen}
          onClose={() => logout()}
          onSuccess={(token) => {
            console.log("2FA verified successfully");
            set2FADisabled(false);
            setToken(token);
            navigate("/");
          }}
        />
      </div>
    );
  }

  return children;
};
