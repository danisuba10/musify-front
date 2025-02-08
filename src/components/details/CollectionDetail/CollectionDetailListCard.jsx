import React, { useState } from "react";

import "../../../styles/details/CollectionDetailListCard.css";
import PlayButton from "./PlayButton";
import DeleteButton from "../AdminPanel/DeleteButton";
import SaveButton from "../AdminPanel/SaveButton";

const CollectionDetailListCard = ({
  details,
  isModify,
  toDelete,
  isMarkedForDelete,
}) => {
  const [newName, setNewName] = useState(details.name);
  const [newOrder, setNewOrder] = useState(details.order);
  const [newDuration, setNewDuration] = useState(
    duration_to_object(details.duration)
  );

  const [isHovered, setIsHovered] = useState(false);

  const saveSongModifications = () => {
    if (isMarkedForDelete) {
      console.log(`Song with ID: ${details.id} deleted using API!`);
      return;
    }
    const newDurationS = object_to_seconds(newDuration);
    if (
      newOrder === details.order &&
      newName === details.name &&
      newDurationS === details.duration
    ) {
      console.log(
        `Song with ID: ${details.id} has not been modified as no new info has been supplied!`
      );
      return;
    }
    console.log(
      `API call has been made to change data for song with ID: ${details.id}!`
    );
  };

  function object_to_seconds(durationObj) {
    return (
      durationObj.hours * 3600 + durationObj.minutes * 60 + durationObj.seconds
    );
  }

  function duration_to_object(duration) {
    return {
      hours: Math.floor(duration / 3600),
      minutes: Math.floor((duration % 3600) / 60),
      seconds: duration % 60,
    };
  }

  function duration_to_str(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${hours > 0 ? `${hours}h : ` : ""}${
      minutes > 0 ? `${minutes}m : ` : ""
    }${seconds}s`;
  }

  const duration_str = duration_to_str(details.duration);

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleOrderChange = (e) => {
    setNewOrder(e.target.value);
  };

  const handleHourChange = (e) => {
    setNewDuration({
      hours: e.target.value,
      minutes: newDuration.minutes,
      seconds: newDuration.seconds,
    });
  };

  const handleMinuteChange = (e) => {
    setNewDuration({
      hours: newDuration.hours,
      minutes: e.target.value,
      seconds: newDuration.seconds,
    });
  };

  const handleSecondChange = (e) => {
    setNewDuration({
      hours: newDuration.hours,
      minutes: newDuration.minutes,
      seconds: e.target.value,
    });
  };

  return (
    <div
      className="detail-list-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={
          isMarkedForDelete
            ? "detail-list-card border-2 border-red-500 rounded-full"
            : "detail-list-card"
        }
      >
        <div className="song-part">
          <div className="list-card-order">
            {!isHovered && !isModify && details.order}
            {isHovered && !isModify && <PlayButton />}
            {isModify && (
              <input
                className="w-[5vw] text-center bg-displayBlack"
                id="newOrder"
                type="text"
                placeholder={newOrder}
                onChange={handleOrderChange}
              />
            )}
          </div>
          <div className="list-card-details">
            <div className="list-card-name">
              {!isModify && details.name}{" "}
              {isModify && (
                <input
                  className="w-full text-svgGrey bg-displayBlack"
                  id="newOrder"
                  type="text"
                  placeholder={newName}
                  onChange={handleNameChange}
                />
              )}
            </div>
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
          <span className="song-duration">
            {!isModify && duration_str}
            {isModify && (
              <div className="relative w-full h-fit flex flex-grow sm:flex-row flex-col gap-1 items-center justify-center pl-2 pr-2">
                <input
                  className="w-full min-w-[3vw] text-svgGrey text-left bg-displayBlack"
                  id="newOrder"
                  type="text"
                  placeholder={`${newDuration.hours}`}
                  onChange={handleHourChange}
                />
                <span className="relative w-full sm:w-min flex items-start text-start">
                  h
                </span>
                <input
                  className="w-full min-w-[3vw] text-svgGrey bg-displayBlack"
                  id="newOrder"
                  type="text"
                  placeholder={`${newDuration.minutes}`}
                  onChange={handleMinuteChange}
                />
                <span className="relative w-full sm:w-min flex items-start text-start">
                  m
                </span>
                <input
                  className="w-full min-w-[3vw] text-svgGrey bg-displayBlack"
                  id="newOrder"
                  type="text"
                  placeholder={`${newDuration.seconds}`}
                  onChange={handleSecondChange}
                />
                <span className="relative w-full sm:w-min flex items-start text-start">
                  s
                </span>
                <div className="h-full w-full min-h-[60px] aspect-square">
                  <DeleteButton onClickFunc={toDelete} />
                </div>
                <div className="h-full w-full min-h-[60px] aspect-square">
                  <SaveButton onClickFunc={saveSongModifications} />
                </div>
              </div>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetailListCard;
