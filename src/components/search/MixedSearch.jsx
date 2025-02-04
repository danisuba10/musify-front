import React from "react";
import { useState } from "react";
import HorizontalScrollGrid from "../homepage/HorizontalScrollGrid";

import { artists } from "../../assets/Constants";

import "../../styles/homepage/home.css";

const MixedSearchResult = (searchTerm) => {
  return (
    <>
      <HorizontalScrollGrid title="Songs" artists={artists} type="circle" />
      <HorizontalScrollGrid title="Albums" artists={artists} />
      <HorizontalScrollGrid
        title="Popular artists"
        artists={artists}
        type="circle"
      />
      <HorizontalScrollGrid title="Artists" artists={artists} />
      <HorizontalScrollGrid title="Playlists" artists={artists} type="circle" />
      <HorizontalScrollGrid title="Users" artists={artists} />
      <div className="mt-10"></div>
    </>
  );
};

export default MixedSearchResult;
