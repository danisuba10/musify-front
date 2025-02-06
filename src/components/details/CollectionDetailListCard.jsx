import React from "react";

import "../../styles/details/CollectionDetailListCard.css";

const CollectionDetailListCard = ({ details }) => {
  function duration_to_str(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${hours > 0 ? `${hours}h : ` : ""}${
      minutes > 0 ? `${minutes}m : ` : ""
    }${seconds}s`;
  }

  const duration_str = duration_to_str(details.duration);

  return (
    <>
      <div className="detail-list-card">
        <div className="detail-list-card-container">
          <div className="song-part">
            <div className="list-card-order">{details.order}</div>
            <div className="list-card-details">
              <div className="list-card-name">{details.name}</div>
              <div className="list-card-artists">
                {details.artists.map((artist, index) => (
                  <button key={index}>
                    <div className="artist-style">{artist}</div>
                    {index < details.artists.length - 1 && (
                      <div className="artist-style">, </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="song-duration-part">
            <span className="song-duration">{duration_str}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionDetailListCard;
