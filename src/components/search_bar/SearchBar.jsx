import React, { useState, useEffect, useContext } from "react";
import "../../styles/searchbar/SearchBar.css";
import Logo from "../../assets/spotify.svg?react";
import Home from "../../assets/home.svg?react";
import Magnifier from "../../assets/magni.svg?react";
import Account from "../../assets/profile.svg?react";
import Admin from "../../assets/admin.svg?react";
import { AuthContext } from "../auth/AuthProvider";

const SearchBar = ({ onClick, onSearch }) => {
  const { isAdmin } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      onSearch(true, value);
    } else {
      onSearch(false, "");
    }
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };
  const handleAdminPanelClick = () => {
    window.location.href = "/admin/";
  };

  return (
    <div className="search-bar-container">
      <div className="logo-container" onClick={handleHomeClick}>
        <Logo className="logo-svg" />
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
          />
        </div>
      </div>
      <div className="user-part float-right">
        {isAdmin && (
          <button
            className="home-button-container"
            onClick={handleAdminPanelClick}
          >
            <Admin className="home-svg" />
          </button>
        )}
        <button className="home-button-container" onClick={onClick}>
          <Account className="home-svg" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
