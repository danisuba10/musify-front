import React, { useContext, useState } from "react";

import FormInput from "./FormInput";
import AddSong from "./AddSong";
import { AuthContext } from "../auth/AuthProvider";
import ViewAlbum from "./ViewAlbum";
import { emptyAlbum } from "../../assets/Constants";
import Search from "../search/Search";

const ModifyAlbum = ({ searchTerm }) => {
  const [showAlbumSearch, setShowAlbumSearch] = useState(false);
  const [albumId, setAlbumId] = useState(null);
  const [currentSelectionFunc, setCurrentSelectionFunc] = useState(null);

  const onChangeAlbumClick = () => {
    setShowAlbumSearch(true);
  };

  const selectAlbum = (album) => {
    setAlbumId(album.id);
  };

  return (
    <>
      {showAlbumSearch && (
        <div className="w-[95%]">
          <Search
            initialTerm={searchTerm}
            selectionFunc={(album) => {
              selectAlbum(album);
              setShowAlbumSearch(false);
            }}
            defaultFilter="Albums"
            onlyFilter={true}
          />
        </div>
      )}
      {!showAlbumSearch && (
        <>
          <button
            className="flex relative p-2 rounded-3xl border-2 border-white mt-4"
            onClick={onChangeAlbumClick}
          >
            <span className="text-white font-bold">
              {albumId ? "Change album" : "Select album"}
            </span>
          </button>
          {albumId && (
            <ViewAlbum id={albumId} searchTerm={searchTerm} isModify={true} />
          )}
          <div className="mt-28"></div>
        </>
      )}
    </>
  );
};

export default ModifyAlbum;
