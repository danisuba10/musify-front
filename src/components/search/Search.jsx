import React, { useEffect } from "react";
import { useState } from "react";
import HorizontalScrollGrid from "../homepage/HorizontalScrollGrid";
import MixedSearch from "./MixedSearch";

import { artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";
import TableSearch from "./TableSearch";

export default function Search({
  initialTerm,
  selectionFunc,
  defaultFilter = "All",
  onlyFilter = false,
}) {
  const [filter, setFilter] = useState(defaultFilter);
  const [searchDisplay, setSearchDisplay] = useState(null);
  const [term, setTerm] = useState(initialTerm);

  const updateSearchDisplay = (filterValue) => {
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
            title={`Artists - ${initialTerm}`}
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

  useEffect(() => {
    updateSearchDisplay(filter);
  }, [filter, term]);

  useEffect(() => {
    updateSearchDisplay(defaultFilter);
  }, [defaultFilter]);

  useEffect(() => {
    setTerm(initialTerm);
  }, [initialTerm]);

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };

  return (
    <div className="homepage-container overflow-x-hidden">
      <div className="search-filter-container">
        {(onlyFilter && defaultFilter === "All") || !onlyFilter ? (
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
        ) : null}
        {(onlyFilter && defaultFilter === "Songs") || !onlyFilter ? (
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
        ) : null}
        {(onlyFilter && defaultFilter === "Albums") || !onlyFilter ? (
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
        ) : null}
        {(onlyFilter && defaultFilter === "Artists") || !onlyFilter ? (
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
        ) : null}
        {(onlyFilter && defaultFilter === "Playlists") || !onlyFilter ? (
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
        ) : null}
        {(onlyFilter && defaultFilter === "Users") || !onlyFilter ? (
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
        ) : null}
      </div>
      {searchDisplay !== null && searchDisplay}
    </div>
  );
}
