import React, { useEffect, useState } from "react";

import "../../styles/details/CollectionDetailCard.css";

const CollectionDetailCard = ({ collection }) => {
  return (
    <>
      <div
        className="collection-detail-card-container"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${collection.colors.low}, ${collection.colors.middle})`,
        }}
      >
        <div className="collection-detail-image-container">
          <img className="collection-detail-img" src={collection.image} />
        </div>
        <div className="collection-detail-about">
          <div className="collection-detail-type">{collection.type}</div>
          <div className="collection-detail-name">{collection.name}</div>
          <div className="collection-detail-details">
            <div className="artist-container">
              <div className="flex flex-col sm:flex-row justify-left items-center gap-2 h-fit w-full">
                <img className="artist-image" src={collection.artist_img} />
                <div className="artist-name">{collection.creator}</div>
              </div>
            </div>
            <div className="about-info">
              <div className="about-info-entry">
                Year: {collection.details.year}
              </div>
              <div className="about-info-entry">
                Songs: {collection.details.song_count}
              </div>
              <div className="about-info-entry">
                Duration: {collection.details.total_length_str}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionDetailCard;
