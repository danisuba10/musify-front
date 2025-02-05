import { useState } from "react";

import "./App.css";
import Home from "./components/homepage/home";
import "./styles/tailwind.css";
import UserLibrary from "./components/user_library/ULibrary";
import SearchBar from "./components/search_bar/SearchBar";
import { use } from "react";
import LoginOverlay from "./components/auth/LoginForm";
import AuthOverlay from "./components/auth/AuthOverlay";

import Search from "./components/search/Search";
import CollectionDetail from "./components/details/CollectionDetail";
import { artist } from "./assets/Constants";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [term, setTerm] = useState("");

  return (
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
        {/* {isSearch ? <Search term={term} /> : <Home />} */}
        {isSearch ? (
          <Search term={term} />
        ) : (
          <CollectionDetail collection={artist} />
        )}
      </div>
      {showLogin && <AuthOverlay onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;
