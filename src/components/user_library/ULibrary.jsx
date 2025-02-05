import React, { useState, useEffect } from "react";
import VerticalScrollGrid from "./VerticalScrollGrid";
import { library } from "../../assets/Constants";
import "../../styles/library/library.css";
import Cookies from "js-cookie";

export default function UserLibrary() {
  const [compact, setCompact] = useState(Cookies.get("compact") === "true");

  useEffect(() => {
    const handleCookieChange = () => {
      if (window.innerHeight > window.innerWidth) {
        if (Cookies.get("compact") === "false") {
          setCompact(true);
        }
        return;
      }
      setCompact(Cookies.get("compact") === "true");
    };

    const cookieChangeListener = setInterval(handleCookieChange, 1000);

    return () => clearInterval(cookieChangeListener);
  }, []);

  return (
    <div
      className={`library-container ${
        compact
          ? `w-[5vw] max-w-[5vw]`
          : " md:min-w-[220px] w-[15vw] max-w-[15vw]"
      }`}
    >
      <VerticalScrollGrid title="Library" cards={library} compact={compact} />
    </div>
  );
}
