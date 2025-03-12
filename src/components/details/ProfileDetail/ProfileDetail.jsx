import React, { useContext, useEffect, useRef, useState } from "react";

import { artist, artists } from "../../../assets/Constants";

import "../../../styles/homepage/home.css";
import CollectionDetailCard from "../CollectionDetail/CollectionDetailCard";
import ProfileActionBar from "./ProfileActionBar";
import HorizontalScrollGrid from "../../homepage/HorizontalScrollGrid";
import { AuthContext } from "../../auth/AuthProvider";

// import CollectionDetailActionBar from "./CollectionDetailActionBar";
// import CollectionDetailList from "./CollectionDetailList";

export default function ProfileDetail({
  profile,
  type = "Profile",
  isModify = false,
  setIsModify,
  toSave = () => {},
  toDelete = () => {},
  horizontalScrollGridDatas,
}) {
  const cardRef = useRef(null);
  const { isAdmin, getUserId } = useContext(AuthContext);

  const hasModifyPermission = () => {
    return isAdmin() || profile.id === getUserId();
  };

  const switchModify = () => {
    console.log("Modify switched");
    console.log("Old isModify, new isModify", isModify, !isModify);
    setIsModify(!isModify);
  };

  const getDTO = () => {
    if (type === "Artist" || type === "Profile") {
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
          userId={profile.id}
          middleColor={profile.colors.middle}
          topColor={profile.colors.top}
          isModify={isModify}
          onSave={() => toSave(getDTO())}
          onDelete={toDelete}
          hasModifyPermission={hasModifyPermission}
          switchModify={switchModify}
          type={type}
        />
        {type === "Artist" && !isModify && (
          <>
            <HorizontalScrollGrid
              title="Top Albums"
              initialElements={profile.albums}
              route={"/album/"}
            />
            <div className="mt-16"></div>
          </>
        )}
        {type === "Profile" && <div className="flex flex-col gap-2"></div>}
        {horizontalScrollGridDatas?.map((data, index) => (
          <HorizontalScrollGrid
            key={index}
            title={data.title}
            initialElements={data.elements}
            route={data.route}
          />
        ))}
        <div className="mt-32"></div>
      </div>
    </div>
  );
}
