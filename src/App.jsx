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
import AdminPanel from "./components/AdminPanel/AdminPanel";
import AuthProvider from "./components/auth/AuthProvider";
import ModifyAlbum from "./components/AdminPanel/ModifyAlbum";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import ViewAlbum from "./components/AdminPanel/ViewAlbum";
import ViewArtist from "./components/AdminPanel/ViewArtist";
import React from "react";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [term, setTerm] = useState("");

  useEffect(() => {
    console.log("New isSearch", isSearch);
  }, [isSearch]);

  const AlbumRoute = () => {
    const { id } = useParams();
    return <ViewAlbum id={id} isModify={false} />;
  };

  const ArtistRoute = () => {
    const { id } = useParams();
    return <ViewArtist id={id} isModify={false} />;
  };

  return (
    <Router>
      <AuthProvider>
        <div className="top-parent">
          <div className="global-search-bar">
            <SearchBar
              onClick={() => setShowLogin(true)}
              onSearch={(is, e) => {
                setIsSearch(is);
                setTerm(e);
              }}
              setIsSearch={setIsSearch}
              setGlobalTerm={setTerm}
              term={term}
            />
          </div>
          <div className="app-container">
            <UserLibrary />
            <Routes>
              <Route
                path="/artist/:id"
                element={
                  isSearch ? (
                    <Search
                      initialTerm={term}
                      key={term}
                      setIsSearch={setIsSearch}
                      setGlobalTerm={setTerm}
                    />
                  ) : (
                    <ArtistRoute />
                  )
                }
              />
              <Route
                path="/album/:id"
                element={
                  isSearch ? (
                    <Search
                      initialTerm={term}
                      key={term}
                      setIsSearch={setIsSearch}
                      setGlobalTerm={setTerm}
                    />
                  ) : (
                    <AlbumRoute />
                  )
                }
              />
              <Route
                path="/profile/:id"
                element={
                  isSearch ? (
                    <Search
                      initialTerm={term}
                      key={term}
                      setIsSearch={setIsSearch}
                      setGlobalTerm={setTerm}
                    />
                  ) : (
                    <ProfileDetail profile={profile} />
                  )
                }
              />
              <Route
                path="/admin/*"
                element={<AdminPanel searchTerm={term} />}
              />
              <Route
                path="/"
                element={
                  isSearch ? (
                    <Search
                      initialTerm={term}
                      key={term}
                      setIsSearch={setIsSearch}
                      setGlobalTerm={setTerm}
                    />
                  ) : (
                    <Home />
                  )
                }
              />
            </Routes>
          </div>
          {showLogin && <AuthOverlay onClose={() => setShowLogin(false)} />}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
