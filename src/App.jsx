import { useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import "./App.css";
import Home from "./components/homepage/Home";
import "./styles/tailwind.css";
import UserLibrary from "./components/user_library/ULibrary";
import SearchBar from "./components/search_bar/SearchBar";
import AuthOverlay from "./components/auth/AuthOverlay";

import Search from "./components/search/Search";
import CollectionDetail from "./components/details/CollectionDetail/CollectionDetail";
import ProfileDetail from "./components/details/ProfileDetail/ProfileDetail";

import { artist, songs, profile } from "./assets/Constants";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [term, setTerm] = useState("");

  return (
    <Router>
      <div className="top-parent">
        <div className="global-search-bar">
          <SearchBar
            onClick={() => setShowLogin(true)}
            onSearch={(is, e) => {
              setIsSearch(is);
              setTerm(e);
            }}
          />
        </div>
        <div className="app-container">
          <UserLibrary />
          <Routes>
            <Route
              path="/"
              element={isSearch ? <Search term={term} /> : <Home />}
            />
            <Route
              path="/artist/:id"
              element={
                isSearch ? (
                  <Search term={term} />
                ) : (
                  <CollectionDetail
                    collection={artist}
                    elements={songs}
                    type="album"
                  />
                )
              }
            />
            <Route
              path="/album/:id"
              element={
                isSearch ? (
                  <Search term={term} />
                ) : (
                  <CollectionDetail collection={artist} elements={songs} />
                )
              }
            />
            <Route
              path="/profile/:id"
              element={
                isSearch ? (
                  <Search term={term} />
                ) : (
                  <ProfileDetail profile={profile} />
                )
              }
            />
          </Routes>
        </div>
        {showLogin && <AuthOverlay onClose={() => setShowLogin(false)} />}
      </div>
    </Router>
  );
}

export default App;
