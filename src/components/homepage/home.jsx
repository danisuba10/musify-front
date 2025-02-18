import React from "react";
import HorizontalScrollGrid from "./HorizontalScrollGrid";
import { apiURL } from "../../assets/Constants";

import { artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";

export default function Home() {
  return (
    <div className="homepage-container">
      <div className="mt-2"></div>
      <HorizontalScrollGrid
        title="Popular artists"
        url={`${apiURL}/artist/search`}
        type="circle"
        route="/artist/"
      />
      <HorizontalScrollGrid
        title="Popular albums"
        url={`${apiURL}/album/search`}
        route="/album/"
      />
      {/*
      <HorizontalScrollGrid
        title="Popular users"
        artists={artists}
        type="circle"
        route="/profile/"
      />
      <HorizontalScrollGrid title="Favourite artists" artists={artists} />
      <HorizontalScrollGrid
        title="Popular artists"
        artists={artists}
        type="circle"
      />
      <HorizontalScrollGrid title="Favourite artists" artists={artists} /> */}
      <div className="mt-10"></div>
    </div>
  );
}
