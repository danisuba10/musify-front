import React, { useContext, useEffect, useRef, useState } from "react";

import { artist, artists } from "../../../assets/Constants";

import "../../../styles/homepage/home.css";
import CollectionDetailCard from "../CollectionDetail/CollectionDetailCard";
import ProfileActionBar from "./ProfileActionBar";
import HorizontalScrollGrid from "../../homepage/HorizontalScrollGrid";
import { AuthContext } from "../../auth/AuthProvider";
import Footer from "../../Footer/Footer";

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
    setIsModify(!isModify);
  };

  const getDTO = () => {
    if (type === "Artist" || type === "Profile") {
      return cardRef.current?.getArtistInfoDTO();
    }
  };

  return (
    <div className="profile-container">
      <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full flex flex-col">
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
              titleRedirect={profile.albumsRedirect}
              initialElements={profile.albums}
              route={"/album/"}
            />
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
        <Footer />
      </div>
    </div>
  );
}
