import React, { useEffect, useState } from "react";
import Modify from "../../../assets/edit.svg?react";

import "../../../styles/details/CollectionDetailCard.css";

const CollectionDetailCard = ({ collection, typeCSS, type, isModify }) => {
  const [followsUser, setFollowsUser] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [nameInput, setNameInput] = useState(collection.name || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(URL.createObjectURL(file));
    }
  };

  const handleNameChange = (e) => {
    setNameInput(e.target.value);
  };

  const triggerFileInput = () => {
    document.getElementById("imageInput").click();
  };

  const type_prop = typeCSS === "circle" ? "rounded-full" : "";
  return (
    <>
      <div
        className="collection-detail-card-container"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${collection.colors.low}, ${collection.colors.middle})`,
        }}
      >
        <div className="collection-detail-image-container">
          {isModify && (
            <>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <img
                className={`collection-detail-img ${type_prop}`}
                src={imageFile || collection.image}
              />
              <div
                onClick={triggerFileInput}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-600/60 to-gray-900/60 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <Modify className="w-12 h-12 fill-white" />
              </div>
            </>
          )}
          {!isModify && (
            <img
              className={`collection-detail-img ${type_prop}`}
              src={imageFile || collection.image}
            />
          )}
        </div>
        <div className="collection-detail-about gap-3">
          <div className="collection-detail-type">{collection.type}</div>
          {isModify && (
            <textarea
              value={nameInput}
              onChange={handleNameChange}
              className="collection-detail-name text-3xl w-[90%] bg-transparent ml-1 min-h-[100px] focus:ring-2 focus:ring-green-500 outline-none"
              placeholder={"Enter album name"}
              rows={1}
            />
          )}
          {!isModify && (
            <div className="collection-detail-name">{collection.name}</div>
          )}
          <div className="collection-detail-details">
            {type === "album" && (
              <>
                <div className="artist-container">
                  <div className="flex flex-col sm:flex-row justify-left items-center gap-2 h-fit w-full">
                    <img className="artist-image" src={collection.artist_img} />
                    <div className="artist-name">{collection.creator}</div>
                  </div>
                </div>
                <div className="about-info">
                  <span className="about-info-entry"> • </span>
                  <div className="about-info-entry">
                    Year: {collection.details.year}
                  </div>
                  <span className="about-info-entry"> • </span>
                  <div className="about-info-entry">
                    Songs: {collection.details.song_count}
                  </div>
                  <span className="about-info-entry"> • </span>
                  <div className="about-info-entry">
                    Duration: {collection.details.total_length_str}
                  </div>
                </div>
              </>
            )}
            {type === "artist" && (
              <>
                <div className="about-info">
                  <div className="about-info-entry">
                    `${collection.details.monthly_listeners} monthly listeners`
                  </div>
                </div>
              </>
            )}
            {type === "user" && (
              <>
                <div className="about-info">
                  <div className="about-info-entry">
                    {collection.details.public_playlist_cnt} Public Playlists
                  </div>
                  <span className="about-info-entry"> • </span>
                  <div className="about-info-entry text-white">
                    {collection.details.followers} Followers
                  </div>
                  <span className="about-info-entry"> • </span>
                  <div className="about-info-entry text-white">
                    {collection.details.following} Following
                  </div>
                  {followsUser && (
                    <>
                      <span className="about-info-entry"> • </span>
                      <div className="about-info-entry">(Follows you)</div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionDetailCard;
