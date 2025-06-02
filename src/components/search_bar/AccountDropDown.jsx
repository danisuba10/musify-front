import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import Account from "../../assets/profile.svg?react";

const AccountDropDown = ({ onSignOut }) => {
  /** @type {React.MutableRefObject<HTMLDivElement | null>} */
  const dropDownRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLButtonElement | null>} */
  const buttonRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropDownPosition] = useState({
    top: 0,
    right: 0,
  });
  const navigate = useNavigate();
  const { userInfo, getUserId } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropDownPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  const handleProfileClick = () => {
    navigate(`/profile/${getUserId()}`);
    setIsOpen(false);
  };

  const handleAccountSecurityClick = () => {
    navigate("/account/security");
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onSignOut();
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        className="home-button-container"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Account className="home-svg" />
      </button>

      {isOpen && (
        <div
          ref={dropDownRef}
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
          }}
          className="fixed w-48 bg-slate-200 rounded-md shadow-lg z-50 border border-gray-200"
        >
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="w-full text-left px-4 py-2 text-sm bg-slate-200 text-gray-700 hover:bg-gray-400"
            >
              My profile
            </button>
            <button
              onClick={handleAccountSecurityClick}
              className="w-full text-left px-4 py-2 text-sm bg-slate-200 text-gray-700 hover:bg-gray-400"
            >
              Account security
            </button>
            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-2 text-sm bg-slate-200 text-gray-700 hover:bg-gray-400"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDropDown;
