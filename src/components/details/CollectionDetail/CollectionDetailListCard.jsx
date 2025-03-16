import React, { useContext, useState, useEffect } from "react";

import "../../../styles/details/CollectionDetailListCard.css";
import PlayButton from "./PlayButton";
import DeleteButton from "../../AdminPanel/DeleteButton";
import SaveButton from "../../AdminPanel/SaveButton";
import SongOptionsMenu from "../MoreOptions/SongOptionsMenu";
import { apiURL } from "../../../assets/Constants";

import {
  duration_to_str,
  duration_to_object,
  object_to_seconds,
} from "../../Service/TimeService";
import { AuthContext } from "../../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

const CollectionDetailListCard = ({
  details,
  isModify,
  toDelete,
  isMarkedForDelete,
  onAddArtist,
  setErrorMessage,
  setSuccessMessage,
  parentType,
  hasPermission,
  queue,
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const { userToken } = useContext(AuthContext);
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
        image: artist.image,
      }))
    )
  );

  useEffect(() => {
    if (details.mainArtist) {
      addOrRemoveArtist(
        {
          id: details.mainArtist.id,
          name: details.mainArtist.name,
          image: details.mainArtist.image,
        },
        "add"
      );
    }
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  const redirToArtist = (id) => {
    navigate(`/artist/${id}`);
  };

  const saveSongModifications = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    const newDurationS = object_to_seconds(newDuration);

    var endPoint;

    if (!details.id) {
      endPoint = `${apiURL}/song/add-song`;
    } else if (!isMarkedForDelete) {
      endPoint = `${apiURL}/song/update-song`;
    }

    const songFormData = new FormData();
    newName && !details.id ? songFormData.append("Title", newName) : null;
    newOrder && !details.id
      ? songFormData.append("PositionInAlbum", newOrder)
      : null;
    newDurationS &&
    !isMarkedForDelete &&
    (newDuration !== details.duration || !details.id)
      ? songFormData.append("Duration", newDurationS)
      : null;

    if (
      !Array.from(newArtists).every((artist) =>
        details.artists.some((detailArtist) => detailArtist.id === artist.id)
      )
    ) {
      newArtists.forEach((artist) => {
        songFormData.append("ArtistIds", artist.id);
      });
    }

    if (!details.id) {
      songFormData.append("AlbumId", details.albumId);
    } else {
      songFormData.append("Id", details.id);
      if (
        songFormData.has("Id") &&
        Array.from(songFormData.keys()).length === 1 &&
        !isMarkedForDelete
      ) {
        setErrorMessage("No modifications detected.");
        return;
      }
    }

    const response = await fetch(endPoint, {
      method: "POST",
      body: songFormData,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      if (!isMarkedForDelete) {
        setSuccessMessage("Song updated successfully!");
      } else {
        setSuccessMessage("Song removed successfully!");
      }
    } else {
      const errorData = await response.json();
      console.log("Error data: ", errorData);
      console.log("Error data title:", errorData.title);
      setErrorMessage(errorData.title);
    }
  };

  const selectionFunc = (artist) => {
    addOrRemoveArtist(artist, "add");
  };

  const addOrRemoveArtist = ({ id, name, image }, type) => {
    setNewArtists((oldArtists) => {
      const updatedArtists = new Set(oldArtists);
      if (type === "add") {
        if (![...updatedArtists].some((artist) => artist.id === id)) {
          updatedArtists.add({ id, name, image });
        }
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

  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
            {((!isHovered && (!isModify || parentType === "Playlist")) ||
              isMobile) &&
              details.order}
            {isHovered &&
              !isMobile &&
              (!isModify || parentType === "Playlist") && (
                <PlayButton
                  onClickFunc={() => {
                    queue.clear();
                    queue.add(details.id);
                  }}
                />
              )}
            {isModify && parentType !== "Playlist" && (
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
              {(!isModify || parentType === "Playlist") && (
                <button
                  onClick={() => {
                    queue.clear();
                    queue.add(details.id);
                  }}
                >
                  {details.name}
                </button>
              )}{" "}
              {isModify && parentType !== "Playlist" && (
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
                    <div className="relative h-12 w-auto aspect-square flex items-center justify-center">
                      <DeleteButton
                        onClickFunc={() => addOrRemoveArtist(artist, "remove")}
                      />
                    </div>
                    <button className="flex flex-row">
                      <div className="flex relative flex-row h-full gap-2 pt-2 pb-2">
                        <img
                          src={artist.image}
                          className="rounded-full aspect-square max-h-[30px]"
                        ></img>
                        <div className="artist-style">{artist.name}</div>
                        {index <= Array.from(newArtists).length - 1 && (
                          <span className="artist-style mr-2">,</span>
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              {!isModify &&
                details.artists.map((artist, index) => (
                  <div className="flex flex-row" key={index}>
                    <div className="flex relative flex-row h-full gap-2 pt-2 pb-2">
                      <button onClick={() => redirToArtist(artist.id)}>
                        <img
                          src={artist.image}
                          className="rounded-full aspect-square max-h-[30px]"
                        ></img>
                      </button>
                      <button
                        className="artist-style"
                        onClick={() => redirToArtist(artist.id)}
                      >
                        {artist.name}
                      </button>
                    </div>
                    {index < details.artists.length - 1 && (
                      <div className="artist-style mr-2 flex flex-col items-center justify-center pt-2 pb-2">
                        ,{" "}
                      </div>
                    )}
                  </div>
                ))}
              {isModify && onAddArtist && (
                <button onClick={() => onAddArtist(selectionFunc)}>
                  <div className="artist-style">Add artist</div>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="song-duration-part">
          {!isModify && userToken && (
            <div className="ml-4">
              <SongOptionsMenu
                songId={details.id}
                songName={details.name}
                hasPermission={hasPermission}
                onSongRemove={toDelete}
              />
            </div>
          )}
          <span className="song-duration">
            {(!isModify || parentType === "Playlist") && (
              <>
                <span>{duration_str}</span>
              </>
            )}
            {isModify && parentType !== "Playlist" && (
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
                {isModify && userToken && (
                  <div className="ml-4">
                    <SongOptionsMenu
                      songId={details.id}
                      songName={details.name}
                      hasPermission={hasPermission}
                      onSongRemove={toDelete}
                    />
                  </div>
                )}
                <div className="h-full w-full min-h-[60px] aspect-square flex items-center justify-center">
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
