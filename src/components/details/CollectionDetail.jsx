import React, { useEffect, useState } from "react";

import { artist } from "../../assets/Constants";

import "../../styles/homepage/home.css";
import CollectionDetailCard from "./CollectionDetailCard";
import CollectionDetailActionBar from "./CollectionDetailActionBar";

export default function CollectionDetail({ collection }) {
  return (
    <div className="detail-container">
      <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full">
        <CollectionDetailCard collection={collection} />
        <CollectionDetailActionBar />
      </div>
    </div>
  );
}
