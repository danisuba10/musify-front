import React, { useState, useEffect } from "react";
import VerticalScrollGrid from "./VerticalScrollGrid";
import { library } from "../../assets/Constants";
import "../../styles/library/library.css";
import Cookies from "js-cookie";

export default function UserLibrary() {
  const [compact, setCompact] = useState(Cookies.get("compact") === "true");

  useEffect(() => {
    const handleCookieChange = () => {
      setCompact(Cookies.get("compact") === "true");
    };

    const cookieChangeListener = setInterval(handleCookieChange, 1000);

    return () => clearInterval(cookieChangeListener);
  }, []);

  const width = compact ? "5vw" : "15vw";
  return (
    <div className="library-container" style={{ maxWidth: `${width}` }}>
      <VerticalScrollGrid title="Library" cards={library} compact={compact} />
    </div>
  );
}
