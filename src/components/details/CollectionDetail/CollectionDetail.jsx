import React, { useEffect, useState } from "react";

import { artist } from "../../../assets/Constants";

import "../../../styles/homepage/home.css";
import CollectionDetailCard from "./CollectionDetailCard";
import CollectionDetailActionBar from "./CollectionDetailActionBar";
import CollectionDetailList from "./CollectionDetailList";

export default function CollectionDetail({ collection, elements, type }) {
  return (
    <div className="detail-container">
      <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full flex flex-col">
        <CollectionDetailCard collection={collection} type={type} />
        <CollectionDetailActionBar
          middleColor={collection.colors.middle}
          topColor={collection.colors.top}
        />
        <div
          className="h-[4vh] w-full"
          style={{
            backgroundImage: "linear-gradient(to bottom, #2a162c, #201c1c)",
          }}
        ></div>
        <CollectionDetailList elements={elements} />
      </div>
    </div>
  );
}
