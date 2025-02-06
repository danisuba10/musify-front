import React, { useState, useEffect } from "react";
import "../../styles/searchbar/SearchBar.css";
import Logo from "../../assets/spotify.svg?react";
import Home from "../../assets/home.svg?react";
import Magnifier from "../../assets/magni.svg?react";
import Account from "../../assets/profile.svg?react";

const SearchBar = ({ onClick, onSearch }) => {
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

  return (
    <div className="search-bar-container">
      <div className="logo-container">
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
        <button className="home-button-container" onClick={onClick}>
          <Account className="home-svg" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
