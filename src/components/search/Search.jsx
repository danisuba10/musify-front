import React from "react";
import { useState } from "react";
import HorizontalScrollGrid from "../homepage/HorizontalScrollGrid";
import MixedSearch from "./MixedSearch";

import { artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";
import TableSearch from "./TableSearch";

export default function Search({ term, selectionFunc, defaultFilter = "All" }) {
  const [filter, setFilter] = useState(defaultFilter);
  const [searchDisplay, setSearchDisplay] = useState(<MixedSearch />);

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
    switch (filterValue) {
      case "All":
        setSearchDisplay(<MixedSearch />);
        break;
      case "Songs":
        setSearchDisplay(
          <TableSearch title="Songs" type="circle" elements={artists} />
        );
        break;
      case "Albums":
        setSearchDisplay(<TableSearch title="Albums" elements={artists} />);
        break;
      case "Artists":
        setSearchDisplay(
          <TableSearch
            title="Artists"
            type="circle"
            elements={artists}
            selectionFunc={selectionFunc}
          />
        );
        break;
      case "Playlists":
        setSearchDisplay(<TableSearch title="Playlists" elements={artists} />);
        break;
      case "Users":
        setSearchDisplay(
          <TableSearch title="Users" type="circle" elements={artists} />
        );
        break;
      default:
        setSearchDisplay(null);
    }
  };

  return (
    <div className="homepage-container overflow-x-hidden">
      <div className="search-filter-container">
        <button
          className={
            filter === "All"
              ? "search-filter-button-selected"
              : "search-filter-button"
          }
          onClick={() => handleFilterClick("All")}
        >
          All
        </button>
        <button
          className={
            filter === "Songs"
              ? "search-filter-button-selected"
              : "search-filter-button"
          }
          onClick={() => handleFilterClick("Songs")}
        >
          Songs
        </button>
        <button
          className={
            filter === "Albums"
              ? "search-filter-button-selected"
              : "search-filter-button"
          }
          onClick={() => handleFilterClick("Albums")}
        >
          Albums
        </button>
        <button
          className={
            filter === "Artists"
              ? "search-filter-button-selected"
              : "search-filter-button"
          }
          onClick={() => handleFilterClick("Artists")}
        >
          Artists
        </button>
        <button
          className={
            filter === "Playlists"
              ? "search-filter-button-selected"
              : "search-filter-button"
          }
          onClick={() => handleFilterClick("Playlists")}
        >
          Playlists
        </button>
        <button
          className={
            filter === "Users"
              ? "search-filter-button-selected"
              : "search-filter-button"
          }
          onClick={() => handleFilterClick("Users")}
        >
          Users
        </button>
      </div>
      {searchDisplay !== null && searchDisplay}
    </div>
  );
}
