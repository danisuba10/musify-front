import { useState } from "react";

import "./App.css";
import Home from "./components/homepage/home";
import "./styles/tailwind.css";
import UserLibrary from "./components/user_library/ULibrary";
import SearchBar from "./components/search_bar/SearchBar";

function App() {
  return (
    <div className="top-parent">
      <div className="global-search-bar">
        <SearchBar />
      </div>
      <div className="app-container">
        <UserLibrary />
        <Home />
      </div>
    </div>
  );
}

export default App;
