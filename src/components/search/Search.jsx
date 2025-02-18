import React, { useEffect } from "react";
import { useState } from "react";
import HorizontalScrollGrid from "../homepage/HorizontalScrollGrid";
import MixedSearch from "./MixedSearch";

import { apiURL, artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";
import TableSearch from "./TableSearch";

import { search } from "../search/SearchFetches";

export default function Search({
  initialTerm,
  selectionFunc,
  defaultFilter = "All",
  onlyFilter = false,
}) {
  const initialFilter =
    sessionStorage.getItem("selectedFilter") || defaultFilter;
  const [filter, setFilter] = useState(initialFilter);
  const [searchDisplay, setSearchDisplay] = useState(null);
  const [term, setTerm] = useState(initialTerm);
  const [queryFunc, setQueryFunc] = useState(null);
  const [lastFoundName, setLastFoundName] = useState(null);
  const [lastFoundCreatedAt, setLastFoundCreatedAt] = useState(null);

  const updateSearchDisplay = (filterValue) => {
    switch (filterValue) {
      case "All":
        setSearchDisplay(<MixedSearch />);
        break;
      case "Songs":
        setQueryFunc(() =>
          search(setSearchDisplay, term, `${apiURL}/song/search`, true, "Songs")
        );
        break;
      case "Albums":
        setQueryFunc(() =>
          search(
            setSearchDisplay,
            term,
            `${apiURL}/album/search`,
            false,
            "Albums"
          )
        );
        break;
      case "Artists":
        setQueryFunc(() =>
          search(
            setSearchDisplay,
            term,
            `${apiURL}/artist/search`,
            true,
            "Artists"
          )
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
    const executeQuery = async () => {
      if (queryFunc) {
        await queryFunc();
      }
    };
    executeQuery();
  }, [term]);

  useEffect(() => {
    sessionStorage.setItem("selectedFilter", filter);
  }, [filter]);

  useEffect(() => {
    updateSearchDisplay(filter);
  }, [filter, term]);

  useEffect(() => {
    updateSearchDisplay(defaultFilter);
  }, [defaultFilter]);

  useEffect(() => {
    setTerm(initialTerm);
  }, [initialTerm]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedFilter", "All");
    };
  }, []);

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
