import React, { useEffect, useState } from "react";

import { artist, artists } from "../../../assets/Constants";

import "../../../styles/homepage/home.css";
import CollectionDetailCard from "../CollectionDetail/CollectionDetailCard";
import ProfileActionBar from "./ProfileActionBar";
import HorizontalScrollGrid from "../../homepage/HorizontalScrollGrid";

// import CollectionDetailActionBar from "./CollectionDetailActionBar";
// import CollectionDetailList from "./CollectionDetailList";

export default function ProfileDetail({ profile, type = "Profile" }) {
  return (
    <div className="profile-container">
      <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full">
        <CollectionDetailCard
          collection={profile}
          typeCSS="circle"
          type={type}
        />
        <ProfileActionBar
          middleColor={profile.colors.middle}
          topColor={profile.colors.top}
        />
        <div className="mt-6"></div>
        <HorizontalScrollGrid
          title="Top Albums"
          initialElements={profile.albums}
        />
        <div className="mt-16"></div>
      </div>
    </div>
  );
}
