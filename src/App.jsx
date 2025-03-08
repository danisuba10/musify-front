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
import ViewPlaylist from "./components/AdminPanel/ViewPlaylist";
import Album from "./components/AdminPanel/Album";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [searchPopupAllowed, setSearchPopupAllowed] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [term, setTerm] = useState("");

  const [isModify, setIsModify] = useState(false);

  const HomeRoute = () => {
    setSearchPopupAllowed(true);
    return <Home />;
  };

  const AlbumRoute = () => {
    setSearchPopupAllowed(true);
    const { id } = useParams();
    return (
      <Album
        id={id}
        searchTerm={term}
        setSearchPopupAllowed={setSearchPopupAllowed}
        isModify={isModify}
        setIsModify={setIsModify}
      />
    );
  };

  const PlaylistRoute = () => {
    setSearchPopupAllowed(true);
    const { id } = useParams();
    return <ViewPlaylist id={id} isModify={true} searchTerm={term} />;
  };

  const ArtistRoute = () => {
    setSearchPopupAllowed(true);
    const { id } = useParams();
    return <ViewArtist id={id} isModify={false} searchTerm={term} />;
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
                  isSearch && searchPopupAllowed ? (
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
                  isSearch && searchPopupAllowed ? (
                    <Search
                      initialTerm={term}
                      key={"search-over-album"}
                      setIsSearch={setIsSearch}
                      setGlobalTerm={setTerm}
                    />
                  ) : (
                    <AlbumRoute />
                  )
                }
              />
              <Route
                path="/playlist/:id"
                element={
                  isSearch && searchPopupAllowed ? (
                    <Search
                      initialTerm={term}
                      key={term}
                      setIsSearch={setIsSearch}
                      setGlobalTerm={setTerm}
                    />
                  ) : (
                    <PlaylistRoute />
                  )
                }
              />
              <Route
                path="/profile/:id"
                element={
                  isSearch && searchPopupAllowed ? (
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
                  isSearch && searchPopupAllowed ? (
                    <Search
                      initialTerm={term}
                      key={term}
                      setIsSearch={setIsSearch}
                      setGlobalTerm={setTerm}
                    />
                  ) : (
                    <HomeRoute />
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
