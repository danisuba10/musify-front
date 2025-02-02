import React from "react";
import HorizontalScrollGrid from "./HorizontalScrollGrid";

import { artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";

export default function Home() {
  return (
    <div className="homepage-container">
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
    </div>
  );
}
