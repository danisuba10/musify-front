import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import Modify from "../../../assets/edit.svg?react";
import {
  duration_to_str,
  duration_to_object,
  object_to_seconds,
} from "../../Service/TimeService";

import "../../../styles/details/CollectionDetailCard.css";

const CollectionDetailCard = forwardRef(
  (
    {
      collection,
      typeCSS,
      type,
      isModify,
      creators,
      onAddArtist,
      onDeleteArtist,
    },
    ref
  ) => {
    const [followsUser, setFollowsUser] = useState(true);
    const [imageFile, setImageFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [nameInput, setNameInput] = useState(collection?.name || "");

    const [newYear, setNewYear] = useState(collection?.details.year || 0);
    const [oldDuration, setOldDuration] = useState(
      duration_to_object(collection?.details.length) || duration_to_object(0)
    );
    const [newDuration, setNewDuration] = useState(
      duration_to_object(collection?.details.length) || duration_to_object(0)
    );

    useImperativeHandle(ref, () => ({
      getAlbumInfoDTO: () => ({
        name: nameInput,
        year: newYear,
        duration: object_to_seconds(newDuration),
        file: selectedFile,
      }),
    }));

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImageFile(URL.createObjectURL(file));
        setSelectedFile(file);
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
            backgroundImage: `linear-gradient(to bottom, ${
              collection?.colors.low || "#6f3a73"
            }, ${collection?.colors.middle || "#3a1e3c"})`,
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
                  src={imageFile || collection?.image}
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
                src={imageFile || collection?.image}
              />
            )}
          </div>
          <div className="collection-detail-about gap-3">
            <div className="collection-detail-type">{collection?.type}</div>
            {isModify && (
              <textarea
                value={nameInput}
                onChange={handleNameChange}
                className="collection-detail-name text-3xl w-[90%] bg-transparent ml-1 min-h-[100px] focus:ring-2 focus:ring-green-500 outline-none"
                placeholder={nameInput || "Enter album name"}
                rows={1}
              />
            )}
            {!isModify && (
              <div className="collection-detail-name">{collection?.name}</div>
            )}
            <div className="collection-detail-details">
              {type === "album" && (
                <>
                  <div className="artist-container">
                    {creators.map((artist, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row justify-left items-center gap-2 h-fit w-fit"
                      >
                        <div className="relative">
                          <img
                            className="artist-image"
                            src={artist.creator_img}
                          />
                          {isModify && (
                            <div
                              onClick={() => onDeleteArtist(artist.id)}
                              className="absolute w-full h-auto aspect-square inset-0 rounded-full bg-gradient-to-b from-red-500/60 to-red-900/60 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            >
                              <span className="flex text-white text-lg w-full h-full leading-none aspect-square items-center justify-center text-center">
                                x
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="artist-name">{artist.creator}</div>
                      </div>
                    ))}
                    {isModify && (
                      <div className="flex flex-col sm:flex-row justify-left items-center gap-2 h-fit w-fit">
                        <button
                          className="artist-name border-2 border-white rounded-full pr-2 pl-2 w-fit"
                          onClick={onAddArtist}
                        >
                          Add artist
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={`about-info ${isModify && "flex-col"}`}>
                    {!isModify && <span className="about-info-entry"> • </span>}
                    <div className="about-info-entry">
                      Year: {!isModify && collection?.details.year}{" "}
                      {isModify && (
                        <input
                          className="w-full min-w-[3vw] text-svgGrey text-center bg-displayBlack focus:ring-1 focus:ring-green-500 outline-none"
                          id="newYear"
                          type="text"
                          placeholder={`${newYear || "0"}`}
                          onChange={(e) => setNewYear(e.target.value)}
                        />
                      )}
                    </div>
                    {!isModify && <span className="about-info-entry"> • </span>}
                    {!isModify && (
                      <div className="about-info-entry">
                        Songs: {collection?.details.song_count}
                      </div>
                    )}
                    {!isModify && <span className="about-info-entry"> • </span>}
                    <div className="about-info-entry">
                      {!isModify && <>Duration: </>}
                      {!isModify && collection?.details.total_length_str}{" "}
                      {/* {isModify && (
                        <div className="relative w-full h-fit flex flex-grow sm:flex-row flex-col gap-1 items-center justify-center pl-2 pr-2">
                          <input
                            className="w-full min-w-[3vw] text-svgGrey text-center bg-displayBlack focus:ring-1 focus:ring-green-500 outline-none"
                            id="newOrder"
                            type="text"
                            placeholder={`${
                              newDuration.hours || oldDuration.hours
                            }`}
                            onChange={(e) => {
                              setNewDuration({
                                hours: e.target.value,
                                minutes: newDuration.minutes,
                                seconds: newDuration.seconds,
                              });
                            }}
                          />
                          <span className="relative w-full sm:w-min flex items-start text-start">
                            h
                          </span>
                          <input
                            className="w-full min-w-[3vw] text-svgGrey text-center bg-displayBlack focus:ring-1 focus:ring-green-500 outline-none"
                            id="newOrder"
                            type="text"
                            placeholder={`${
                              newDuration.minutes || oldDuration.seconds
                            }`}
                            onChange={(e) => {
                              setNewDuration({
                                hours: newDuration.hours,
                                minutes: e.target.value,
                                seconds: newDuration.seconds,
                              });
                            }}
                          />
                          <span className="relative w-full sm:w-min flex items-start text-start">
                            m
                          </span>
                          <input
                            className="w-full min-w-[3vw] text-svgGrey text-center bg-displayBlack focus:ring-1 focus:ring-green-500 outline-none"
                            id="newOrder"
                            type="text"
                            placeholder={`${
                              newDuration.seconds || oldDuration.seconds
                            }`}
                            onChange={(e) => {
                              setNewDuration({
                                hours: newDuration.hours,
                                minutes: newDuration.minutes,
                                seconds: e.target.value,
                              });
                            }}
                          />
                        </div>
                      )} */}
                    </div>
                  </div>
                </>
              )}
              {type === "artist" && (
                <>
                  <div className="about-info">
                    <div className="about-info-entry">
                      {collection?.details.monthly_listeners} monthly listeners
                    </div>
                  </div>
                </>
              )}
              {type === "user" && (
                <>
                  <div className="about-info">
                    <div className="about-info-entry">
                      {collection?.details.public_playlist_cnt} Public Playlists
                    </div>
                    <span className="about-info-entry"> • </span>
                    <div className="about-info-entry text-white">
                      {collection?.details.followers} Followers
                    </div>
                    <span className="about-info-entry"> • </span>
                    <div className="about-info-entry text-white">
                      {collection?.details.following} Following
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
  }
);

export default CollectionDetailCard;
