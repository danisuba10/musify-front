import React, { useEffect, useState } from "react";

import "../../../styles/details/CollectionDetailCard.css";

const CollectionDetailCard = ({ collection, typeCSS, type }) => {
  const [followsUser, setFollowsUser] = useState(true);

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
          <img
            className={`collection-detail-img ${type_prop}`}
            src={collection.image}
          />
        </div>
        <div className="collection-detail-about">
          <div className="collection-detail-type">{collection.type}</div>
          <div className="collection-detail-name">{collection.name}</div>
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
