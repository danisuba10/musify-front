import React, { useEffect, useRef, useContext } from "react";
import { useState } from "react";
import HorizontalScrollGrid from "../homepage/HorizontalScrollGrid";
import MixedSearch from "./MixedSearch";

import { apiURL, artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";
import TableSearch from "./TableSearch";

import { search } from "../search/SearchFetches";
import { debounce } from "../Service/Debounce";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

export default function Search({
  initialTerm,
  selectionFunc = null,
  defaultFilter = "All",
  onlyFilter = false,
  setIsSearch,
  setGlobalTerm,
}) {
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const initialFilter =
    defaultFilter != "All" && defaultFilter
      ? defaultFilter
      : sessionStorage.getItem("selectedFilter") ?? "All";
  const [filter, setFilter] = useState(initialFilter);
  const [searchDisplay, setSearchDisplay] = useState(null);
  const [term, setTerm] = useState(initialTerm);

  const lastFoundNameRef = useRef(null);
  const lastFoundCreatedAtRef = useRef(null);
  const [lastFoundName, setLastFoundName] = useState(null);
  const [lastFoundCreatedAt, setLastFoundCreatedAt] = useState(null);

  useEffect(() => {
    lastFoundNameRef.current = lastFoundName;
    lastFoundCreatedAtRef.current = lastFoundCreatedAt;
  }, [lastFoundName, lastFoundCreatedAt]);

  const hasMoreRef = useRef();
  const [hasMore, setHasMore] = useState(true);
  const resultsRef = useRef(null);
  const [results, setResults] = useState([]);

  const scrollPositionRef = useRef(0);

  useEffect(() => {
    resultsRef.current = results;

    const container = document.querySelector(".table-container");
    if (container && results.length > 0) {
      container.scrollTop = scrollPositionRef.current;
    }
  }, [results]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const loadMore = async (filterValue) => {
    if (!hasMoreRef.current) return;

    const searchParams = {
      setSearchDisplay: setSearchDisplay,
      term: term,
      rounded: filterValue === "Songs" || filterValue === "Artists",
      title: filterValue,
      setLastFoundName: setLastFoundName,
      setLastFoundCreatedAt: setLastFoundCreatedAt,
      lastName: lastFoundNameRef.current || "",
      lastCreatedAt: lastFoundCreatedAtRef.current || "",
      existingResults: resultsRef.current,
      setHasMore: setHasMore,
      onLoadMore: () => loadMore(filterValue),
      selectionFunc: selectionFunc,
      userToken: userToken,
    };

    var endPoint = "";

    switch (filterValue) {
      case "All":
        setSearchDisplay(
          <MixedSearch
            term={term}
            clearSearch={() => {
              if (setIsSearch) {
                setIsSearch(false);
              }
              if (setGlobalTerm) {
                setGlobalTerm("");
              }
            }}
          />
        );
        return;
      case "Songs":
        endPoint = `${apiURL}/song/search`;
        searchParams.onClickRedir = (id) => {
          if (setIsSearch) {
            setIsSearch(false);
          }
          if (setGlobalTerm) {
            setGlobalTerm("");
          }
          navigate(`/album/${id}`);
        };
        break;
      case "Albums":
        endPoint = `${apiURL}/album/search`;
        searchParams.onClickRedir = (id) => {
          if (setIsSearch) {
            setIsSearch(false);
          }
          if (setGlobalTerm) {
            setGlobalTerm("");
          }
          navigate(`/album/${id}`);
        };
        break;
      case "Artists":
        endPoint = `${apiURL}/artist/search`;
        searchParams.onClickRedir = (id) => {
          if (setIsSearch) {
            setIsSearch(false);
          }
          if (setGlobalTerm) {
            setGlobalTerm("");
          }
          navigate(`/artist/${id}`);
        };
        break;
      case "Playlists":
        endPoint = `${apiURL}/playlist/search`;
        searchParams.onClickRedir = (id) => {
          if (setIsSearch) {
            setIsSearch(false);
          }
          if (setGlobalTerm) {
            setGlobalTerm("");
          }
          navigate(`/playlist/${id}`);
        };
        break;
      case "Users":
        endPoint = `${apiURL}/user/search`;
        searchParams.onClickRedir = (id) => {
          if (setIsSearch) {
            setIsSearch(false);
          }
          if (setGlobalTerm) {
            setGlobalTerm("");
          }
          navigate(`/profile/${id}`);
        };
        break;
      default:
        setSearchDisplay(null);
    }

    const container = document.querySelector(".table-container");
    scrollPositionRef.current = container ? container.scrollTop : 0;

    const newResults = await search({
      ...searchParams,
      endPoint: endPoint,
    });

    setResults((prevResults) => [...prevResults, ...newResults]);
  };

  useEffect(() => {
    setSearchDisplay(null);
    setResults([]);
    setLastFoundName("");
    setLastFoundCreatedAt("");
    setHasMore(true);
  }, [location.pathname]);

  const updateSearchDisplay = async (filterValue) => {
    setSearchDisplay(null);
    setResults([]);
    setLastFoundName("");
    setLastFoundCreatedAt("");
    setHasMore(true);

    setTimeout(async () => {
      await loadMore(filterValue);
    }, 10);
  };

  const fetchData = debounce(async () => {
    await updateSearchDisplay(filter);
  }, 400);

  useEffect(() => {
    if (setGlobalTerm) {
      //Force reload to fix race condition
      setGlobalTerm(term);
    }
    sessionStorage.setItem("selectedFilter", filter);

    // Wait for the first render
    const timeout = setTimeout(() => {
      fetchData();
    }, 0);

    return () => {
      clearTimeout(timeout);
      fetchData.cancel();
    };
  }, [filter, term, defaultFilter]);

  useEffect(() => {
    setTerm(initialTerm);
  }, [initialTerm]);

  useEffect(() => {
    return () => {
      sessionStorage.setItem("selectedFilter", "All");
      setSearchDisplay(null);
      setResults([]);
      setLastFoundName("");
      setLastFoundCreatedAt("");
      setHasMore(true);
    };
  }, []);

  const handleFilterClick = (filterValue) => {
    setFilter(filterValue);
  };

  return (
    <div className="homepage-container overflow-x-hidden overflow-y-hidden">
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
