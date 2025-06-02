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
import Profile from "./components/User/Profile";
import MusicPlayer from "./components/MusicPlayer/MusicPlayer";
import { apiURL } from "./assets/Constants";
import QueueProvider, { useQueue } from "./components/MusicPlayer/Queue";
import Footer from "./components/Footer/Footer";
import TwoFactorSetup from "./components/2FA/TwoFactorSetup";
import TwoFactorVerification from "./components/2FA/TwoFactorVerification";
import { RequireAuth } from "./components/2FA/AutoWrapper";
import TwoFactorDisable from "./components/2FA/TwoFactorDisable";
import { TwoFactorProvider } from "./components/Context/TwoFactorContext";
import TwoFactorSettings from "./components/2FA/TwoFactorSettings";

const AlbumRoute = ({ term, isModify, setIsModify, setSearchPopupAllowed }) => {
  const { id } = useParams();
  return (
    <Album
      id={id}
      searchTerm={term}
      isModify={isModify}
      setIsModify={setIsModify}
      queue={useQueue()}
      setSearchPopupAllowed={setSearchPopupAllowed}
    />
  );
};

const ProfileRoute = ({ isModify, setIsModify }) => {
  const { id } = useParams();
  return <Profile id={id} isModify={isModify} setIsModify={setIsModify} />;
};

const PlaylistRoute = ({ term }) => {
  const { id } = useParams();
  return (
    <ViewPlaylist
      id={id}
      isModify={true}
      searchTerm={term}
      queue={useQueue()}
    />
  );
};

const ArtistRoute = ({ term }) => {
  const { id } = useParams();
  return <ViewArtist id={id} isModify={false} searchTerm={term} />;
};

const ArtistAlbumsRoute = ({ term }) => {
  const { id } = useParams();
  return (
    <Search
      initialTerm={term}
      defaultFilter="Albums"
      onlyFilter={true}
      customURL={`${apiURL}/artist/${encodeURI(id)}/albums`}
    />
  );
};

const MusicPlayerWithQueue = () => {
  const queue = useQueue();
  return <MusicPlayer queue={queue} />;
};

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [searchPopupAllowed, setSearchPopupAllowed] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [term, setTerm] = useState("");

  const [currentSongId, setCurrentSongId] = useState(null);
  const [songIdQueue, setSongIdQueue] = useState({
    queue: [],
    add(songId) {
      this.queue = [...this.queue, songId];
      setSongIdQueue({ ...this });
    },
    remove() {
      this.queue = this.queue.slice(1);
      setSongIdQueue({ ...this });
    },
    clear() {
      this.queue = [];
      setSongIdQueue({ ...this });
    },
  });

  const [isModify, setIsModify] = useState(false);

  const HomeRoute = () => {
    setSearchPopupAllowed(true);
    return <Home />;
  };

  return (
    <Router>
      <AuthProvider>
        <QueueProvider>
          <TwoFactorProvider>
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
              <RequireAuth require2FA={true}>
                <div className="app-container">
                  <div className="flex flex-row gap-5 h-full overflow-hidden">
                    <UserLibrary />
                    <div className="h-full w-full overflow-auto">
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
                                defaultFilter="All"
                              />
                            ) : (
                              <ArtistRoute term={term} />
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
                                defaultFilter="All"
                              />
                            ) : (
                              <AlbumRoute
                                term={term}
                                isModify={isModify}
                                setIsModify={setIsModify}
                                setSearchPopupAllowed={setSearchPopupAllowed}
                              />
                            )
                          }
                        />
                        <Route
                          path="/artist/:id/albums"
                          element={<ArtistAlbumsRoute term={term} />}
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
                                defaultFilter="All"
                              />
                            ) : (
                              <PlaylistRoute term={term} />
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
                                defaultFilter="All"
                              />
                            ) : (
                              <ProfileRoute
                                isModify={isModify}
                                setIsModify={setIsModify}
                              />
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
                                defaultFilter="All"
                              />
                            ) : (
                              <HomeRoute />
                            )
                          }
                        />
                        <Route
                          path="/account/security"
                          element={<TwoFactorSettings />}
                        />
                      </Routes>
                    </div>
                  </div>
                </div>
                {showLogin && (
                  <AuthOverlay onClose={() => setShowLogin(false)} />
                )}
                <MusicPlayerWithQueue />
              </RequireAuth>
            </div>
          </TwoFactorProvider>
        </QueueProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
