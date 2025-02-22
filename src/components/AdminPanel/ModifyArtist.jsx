import React, { useState } from "react";
import ViewArtist from "./ViewArtist";
import Search from "../search/Search";

const ModifyArtist = ({ searchTerm }) => {
  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [artistId, setArtistId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const onChangeArtistClick = () => {
    setShowArtistSearch(true);
  };

  const selectArtist = (artist) => {
    setArtistId(artist.id);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {showArtistSearch && (
        <div className="w-[95%]">
          <Search
            initialTerm={searchTerm}
            selectionFunc={(artist) => {
              selectArtist(artist);
              setShowArtistSearch(false);
            }}
            defaultFilter="Artists"
            onlyFilter={true}
          />
        </div>
      )}

      {!showArtistSearch && (
        <>
          <button
            className="flex relative p-2 rounded-3xl border-2 border-white mt-4"
            onClick={onChangeArtistClick}
          >
            <span className="text-white font-bold">
              {artistId ? "Change artist" : "Select artist"}
            </span>
          </button>
          {successMessage && (
            <div className="flex flex-grow h-fit border-2 border-green-500 w-[50%] rounded-3xl py-2 px-6">
              <span className="text-white font-bold text-xl">
                {successMessage}
              </span>
            </div>
          )}
          {errorMessage && (
            <div className="flex flex-grow h-fit border-2 border-orange-500 w-[50%] rounded-3xl py-2 px-6">
              <span className="text-white font-bold text-xl">
                {errorMessage}
              </span>
            </div>
          )}
          {artistId && (
            <div className="w-full">
              <ViewArtist
                id={artistId}
                isModify={true}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ModifyArtist;
