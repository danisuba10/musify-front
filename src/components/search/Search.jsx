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
  const [queryFunc, setQueryFunc] = useState(null);
  const [lastFoundName, setLastFoundName] = useState(null);
  const [lastFoundCreatedAt, setLastFoundCreatedAt] = useState(null);

  const searchAlbums = () => {
    const formData = new FormData();
    formData.append("SearchTerm", term);
    formData.append("LastName", "");
    formData.append("LastCreatedAt", "");
    formData.append("PageSize", 50);

    setSearchDisplay(
      <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
        Loading..
      </div>
    );

    fetch("http://localhost:5231/album/search", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data fetched: ", data);
        if (
          !data.searchResults ||
          !data.searchResults.$values ||
          data.searchResults.$values.length === 0
        ) {
          setSearchDisplay(
            <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
              No albums found for "{term}".
            </div>
          );
        } else {
          const albums = data.searchResults.$values.map((album) => ({
            id: album.id,
            name: album.name,
            image: `http://localhost:5231/image/${encodeURIComponent(
              album.imageLocation
            )}`,
          }));
          setSearchDisplay(<TableSearch title="Albums" elements={albums} />);
        }
      })
      .catch((error) => {
        console.error("Error fetching albums:", error);
        setSearchDisplay(
          <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
            No results.
          </div>
        );
      });
  };

  useEffect(() => {
    if (queryFunc) {
      queryFunc();
    }
  }, [term]);

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
        // setSearchDisplay(<TableSearch title="Albums" elements={artists} />);
        setQueryFunc(searchAlbums);
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
