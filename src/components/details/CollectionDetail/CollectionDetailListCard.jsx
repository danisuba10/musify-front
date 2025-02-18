import React, { useState } from "react";

import "../../../styles/details/CollectionDetailListCard.css";
import PlayButton from "./PlayButton";
import DeleteButton from "../../AdminPanel/DeleteButton";
import SaveButton from "../../AdminPanel/SaveButton";
import {
  duration_to_str,
  duration_to_object,
  object_to_seconds,
} from "../../Service/TimeService";

const CollectionDetailListCard = ({
  details,
  isModify,
  toDelete,
  isMarkedForDelete,
  onAddArtist,
}) => {
  const [newName, setNewName] = useState(details.name);
  const [newOrder, setNewOrder] = useState(details.order);
  const [oldDuration, setOldDuration] = useState(
    duration_to_object(details.duration)
  );
  const [newDuration, setNewDuration] = useState(
    duration_to_object(details.duration)
  );
  const [newArtists, setNewArtists] = useState(
    new Set(
      details.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      }))
    )
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

  const selectionFunc = (artist) => {
    addOrRemoveArtist(artist, "add");
  };

  const addOrRemoveArtist = ({ id, name }, type) => {
    setNewArtists((oldArtists) => {
      const updatedArtists = new Set(oldArtists);
      if (type === "add") {
        console.log(`Artist {id:${id}} name:${name}} added!`);
        updatedArtists.add({ id, name });
      } else if (type === "remove") {
        updatedArtists.forEach((artist) => {
          if (artist.id === id && artist.name === name) {
            updatedArtists.delete(artist);
          }
        });
      }
      return updatedArtists;
    });
  };

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
              {isModify &&
                Array.from(newArtists).map((artist, index) => (
                  <div key={index} className="artist-button">
                    <button className="flex flex-row">
                      <div className="artist-style">{artist.name}</div>
                      {index <= Array.from(newArtists).length - 1 && (
                        <span className="artist-style mr-2">,</span>
                      )}
                    </button>
                    <div className="relative h-12 w-auto aspect-square flex items-center justify-center">
                      <DeleteButton
                        onClickFunc={() => addOrRemoveArtist(artist, "remove")}
                      />
                    </div>
                  </div>
                ))}
              {!isModify &&
                details.artists.map((artist, index) => (
                  <button key={index}>
                    <div className="artist-style">{artist.name}</div>
                    {index < details.artists.length - 1 && (
                      <div className="artist-style">, </div>
                    )}
                  </button>
                ))}
              {isModify && (
                <button onClick={() => onAddArtist(selectionFunc)}>
                  <div className="artist-style">Add artist</div>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="song-duration-part">
          <span className="song-duration">
            {!isModify && duration_str}
            {isModify && (
              <div className="relative w-full h-fit flex flex-grow sm:flex-row flex-col gap-1 items-center justify-center pl-2 pr-2">
                <input
                  className="w-full min-w-[3vw] text-svgGrey text-center bg-displayBlack focus:ring-1 focus:ring-green-500 outline-none"
                  id="newOrder"
                  type="text"
                  placeholder={`${newDuration.hours || oldDuration.hours}`}
                  onChange={handleHourChange}
                />
                <span className="relative w-full sm:w-min flex items-start text-start">
                  h
                </span>
                <input
                  className="w-full min-w-[3vw] text-svgGrey text-center bg-displayBlack focus:ring-1 focus:ring-green-500 outline-none"
                  id="newOrder"
                  type="text"
                  placeholder={`${newDuration.minutes || oldDuration.seconds}`}
                  onChange={handleMinuteChange}
                />
                <span className="relative w-full sm:w-min flex items-start text-start">
                  m
                </span>
                <input
                  className="w-full min-w-[3vw] text-svgGrey text-center bg-displayBlack focus:ring-1 focus:ring-green-500 outline-none"
                  id="newOrder"
                  type="text"
                  placeholder={`${newDuration.seconds || oldDuration.seconds}`}
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
