import React, { useEffect, useState } from "react";

import { artist, artists } from "../../../assets/Constants";

import "../../../styles/homepage/home.css";
import CollectionDetailCard from "../CollectionDetail/CollectionDetailCard";
import ProfileActionBar from "./ProfileActionBar";
import HorizontalScrollGrid from "../../homepage/HorizontalScrollGrid";

// import CollectionDetailActionBar from "./CollectionDetailActionBar";
// import CollectionDetailList from "./CollectionDetailList";

export default function ProfileDetail({ profile }) {
  return (
    <div className="profile-container">
      <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full">
        <CollectionDetailCard
          collection={profile}
          typeCSS="circle"
          type="user"
        />
        <ProfileActionBar
          middleColor={profile.colors.middle}
          topColor={profile.colors.top}
        />
        <div className="mt-6"></div>
        <HorizontalScrollGrid
          title="Followers"
          type="circle"
          artists={artists}
          route="/profile/"
        />
        <HorizontalScrollGrid
          title="Playlists"
          artists={artists}
          route="/plalist/"
        />
        <div className="mt-16"></div>
        <div
          className="h-[4vh] w-full"
          style={{
            backgroundImage: "linear-gradient(to bottom, #2a162c, #201c1c)",
          }}
        ></div>
      </div>
    </div>
  );
}
