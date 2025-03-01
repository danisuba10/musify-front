import React, { useEffect, useRef, useState } from "react";

import { artist, artists } from "../../../assets/Constants";

import "../../../styles/homepage/home.css";
import CollectionDetailCard from "../CollectionDetail/CollectionDetailCard";
import ProfileActionBar from "./ProfileActionBar";
import HorizontalScrollGrid from "../../homepage/HorizontalScrollGrid";

// import CollectionDetailActionBar from "./CollectionDetailActionBar";
// import CollectionDetailList from "./CollectionDetailList";

export default function ProfileDetail({
  profile,
  type = "Profile",
  isModify = false,
  toSave = () => {},
  toDelete = () => {},
}) {
  const cardRef = useRef(null);

  const getDTO = () => {
    if (type === "Artist") {
      console.log("Got DTO: ", cardRef.current?.getArtistInfoDTO());
      return cardRef.current?.getArtistInfoDTO();
    }
  };

  return (
    <div className="profile-container">
      <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full">
        <CollectionDetailCard
          ref={cardRef}
          collection={profile}
          typeCSS="circle"
          type={type}
          isModify={isModify}
        />
        <ProfileActionBar
          middleColor={profile.colors.middle}
          topColor={profile.colors.top}
          isModify={isModify}
          onSave={() => toSave(getDTO())}
          onDelete={toDelete}
        />
        <div className="mt-6"></div>
        {!isModify && (
          <HorizontalScrollGrid
            title="Top Albums"
            initialElements={profile.albums}
          />
        )}
        <div className="mt-16"></div>
      </div>
    </div>
  );
}
