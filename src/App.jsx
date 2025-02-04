import { useState } from "react";

import "./App.css";
import Home from "./components/homepage/home";
import "./styles/tailwind.css";
import UserLibrary from "./components/user_library/ULibrary";
import SearchBar from "./components/search_bar/SearchBar";
import { use } from "react";
import LoginOverlay from "./components/auth/LoginForm";
import AuthOverlay from "./components/auth/AuthOverlay";

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="top-parent">
      <div className="global-search-bar">
        <SearchBar onClick={() => setShowLogin(true)} />
      </div>
      <div className="app-container">
        <UserLibrary />
        <Home />
      </div>
      {showLogin && <AuthOverlay onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;
