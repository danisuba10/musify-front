import React from "react";
import HorizontalScrollGrid from "./HorizontalScrollGrid";

import { artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";

export default function Home() {
  return (
    <div className="homepage-container">
      <div className="mt-2"></div>
      <HorizontalScrollGrid
        title="Popular artists"
        artists={artists}
        type="circle"
      />
      <HorizontalScrollGrid title="Favourite artists" artists={artists} />
      <HorizontalScrollGrid
        title="Popular artists"
        artists={artists}
        type="circle"
      />
      <HorizontalScrollGrid title="Favourite artists" artists={artists} />
      <HorizontalScrollGrid
        title="Popular artists"
        artists={artists}
        type="circle"
      />
      <HorizontalScrollGrid title="Favourite artists" artists={artists} />
      <div className="mt-10"></div>
    </div>
  );
}
