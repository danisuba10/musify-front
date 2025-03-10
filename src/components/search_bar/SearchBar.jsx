import React, { useState, useEffect, useContext } from "react";
import "../../styles/searchbar/SearchBar.css";
import Logo from "../../assets/lightning.svg?react";
import Home from "../../assets/home.svg?react";
import Magnifier from "../../assets/magni.svg?react";
import Account from "../../assets/profile.svg?react";
import Admin from "../../assets/admin.svg?react";
import { AuthContext } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import AccountDropDown from "./AccountDropDown";

const SearchBar = ({ onClick, onSearch, setTerm, setIsSearch, term }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState(term);

  const { userToken, logout } = useContext(AuthContext);

  useEffect(() => {
    if (term === "") {
      setInputValue("");
    }
  });

  const { isAdmin } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      onSearch(true, value);
    } else {
      onSearch(false, "");
    }
  };

  const handleHomeClick = () => {
    if (setTerm) {
      setTerm("");
    }
    if (setIsSearch) {
      setIsSearch(false);
    }
    navigate("/");
  };
  const handleAdminPanelClick = () => {
    if (setTerm) {
      setTerm("");
    }
    if (setIsSearch) {
      setIsSearch(false);
    }
    navigate("/admin/");
  };

  return (
    <div className="search-bar-container">
      <div className="h-full flex flex-col justify-center items-center aspect-square">
        <div className="logo-container" onClick={handleHomeClick}>
          <Logo className="logo-svg" />
        </div>
      </div>
      <div className="main">
        <div className="home-button-container" onClick={handleHomeClick}>
          <Home className="home-svg" />
        </div>
        <div className="search-input">
          <Magnifier className="search-magni-svg float-left ml-3" />
          <div className="search-text-field"></div>
          <input
            type="text"
            className="search-input-field"
            placeholder="Search..."
            onChange={handleInputChange}
            value={inputValue}
          />
        </div>
      </div>
      <div className="user-part float-right">
        {isAdmin() && (
          <button
            className="home-button-container"
            onClick={handleAdminPanelClick}
          >
            <Admin className="home-svg" />
          </button>
        )}
        {userToken ? (
          <AccountDropDown onSignOut={logout} />
        ) : (
          <button className="home-button-container" onClick={onClick}>
            <Account className="home-svg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
