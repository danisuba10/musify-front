import React, { useState, useEffect } from "react";
import VerticalScrollGrid from "./VerticalScrollGrid";
import { library } from "../../assets/Constants";
import "../../styles/library/library.css";
import Cookies from "js-cookie";

export default function UserLibrary() {
  const [compact, setCompact] = useState(true);

  useEffect(() => {
    const handleCookieChange = () => {
      if (window.innerHeight > window.innerWidth) {
        if (Cookies.get("compact") === "false") {
          setCompact(true);
        }
        return;
      }
      ssetCompact(Cookies.get("compact") !== "false");
    };

    const cookieChangeListener = setInterval(handleCookieChange, 1000);

    return () => clearInterval(cookieChangeListener);
  }, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth < 600 ? null : (
    <div
      className={`library-container ${
        compact
          ? `md:min-w-fit w-[5vw] max-w-[5vw]`
          : " md:min-w-[220px] w-[15vw] max-w-[15vw]"
      }`}
    >
      <VerticalScrollGrid title="Library" cards={library} compact={compact} />
    </div>
  );
}
