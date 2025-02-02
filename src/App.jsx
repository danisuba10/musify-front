import { useState } from "react";

import "./App.css";
import Home from "./components/homepage/home";
import "./styles/tailwind.css";
import UserLibrary from "./components/user_library/ULibrary";

function App() {
  return (
    <div className="top-parent">
      <div className="top-bar"></div>
      <div className="app-container">
        <UserLibrary />
        <Home />
      </div>
    </div>
  );
}

export default App;
