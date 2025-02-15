import React, { useState, useRef, useEffect } from "react";

import "../../styles/homepage/home.css";
import CollectionDetailCard from "../details/CollectionDetail/CollectionDetailCard";
import CollectionDetailActionBar from "../details/CollectionDetail/CollectionDetailActionBar";
import CollectionDetailList from "../details/CollectionDetail/CollectionDetailList";
import Search from "../search/Search";

const ModifyAlbum = ({ id, collection, elements, searchTerm, isAdd }) => {
  const [markedToBeDeleted, setMarkedToBeDeleted] = useState(false);
  const [songsToBeDeleted, setSongsToBeDeleted] = useState(new Set());
  const [creators, setCreators] = useState(collection?.creators || []);

  const cardRef = useRef(null);
  const makeChange = () => {
    const albumDTO = cardRef.current.getAlbumInfoDTO();
    const artistIds = creators.map((creator) => creator.id);

    const updateAlbumData = new FormData();
    updateAlbumData.append("Id", id);
    updateAlbumData.append("Name", albumDTO.name);
    updateAlbumData.append("Year", albumDTO.year);
    updateAlbumData.append("FormFile", albumDTO.file);
    updateAlbumData.append("ArtistIds", artistIds);
    console.log(updateAlbumData);
  };

  const deleteAlbum = () => {
    console.log(`Album marked to be deleted: ${!markedToBeDeleted}`);
    setMarkedToBeDeleted(!markedToBeDeleted);
  };

  const deleteItemFromList = (itemId) => {
    setSongsToBeDeleted((prevSongs) => {
      const updatedSongs = new Set(prevSongs);
      if (prevSongs.has(itemId)) {
        updatedSongs.delete(itemId);
      } else {
        updatedSongs.add(itemId);
      }
      return updatedSongs;
    });
  };

  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [currentSelectionFunc, setCurrentSelectionFunc] = useState(null);

  const searchRef = useRef(null);

  const handleAddArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    setShowArtistSearch(true);
  };

  const handleAddAlbumArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    setShowArtistSearch(true);
  };

  const addAlbumArtist = (artist) => {
    setCreators((prevCreators) => {
      const artistExists = prevCreators.some(
        (creator) => creator.id === artist.id
      );
      if (!artistExists) {
        console.log(`Album artist added: ${artist.name} (${artist.id})`);
        console.log(artist);
        return [
          ...prevCreators,
          {
            id: artist.id,
            creator: artist.name,
            creator_img: artist.image || "",
          },
        ];
      }
      return prevCreators;
    });
  };

  const deleteCreator = (id) => {
    setCreators((prevCreators) =>
      prevCreators.filter((creator) => creator.id !== id)
    );
    console.log(`Album artist with ID: ${creatorId} removed!`);
  };

  const closeSearch = () => {
    setShowArtistSearch(false);
  };

  useEffect(() => {
    if (showArtistSearch && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showArtistSearch]);

  return (
    <>
      <div className="detail-container">
        <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full">
          {showArtistSearch && (
            <div ref={searchRef} className="w-[95%]">
              <Search
                initialTerm={searchTerm}
                selectionFunc={(artist) => {
                  if (currentSelectionFunc) {
                    currentSelectionFunc(artist);
                  }
                  setShowArtistSearch(false);
                }}
                defaultFilter="Artists"
                onlyFilter={true}
              />
            </div>
          )}
          <CollectionDetailCard
            ref={cardRef}
            collection={collection}
            type="album"
            isModify={true}
            creators={creators}
            onAddArtist={() => handleAddAlbumArtist(addAlbumArtist)}
            onDeleteArtist={deleteCreator}
          />
          <CollectionDetailActionBar
            middleColor={collection?.colors.middle || "#3a1e3c"}
            topColor={collection?.colors.top || "#2a162c"}
            isModify={true}
            toDelete={deleteAlbum}
            isAdd={isAdd}
            toSave={makeChange}
          />
          {elements && (
            <CollectionDetailList
              elements={elements}
              isModify={true}
              toDelete={deleteItemFromList}
              itemsToBeDeleted={songsToBeDeleted}
              searchTerm={searchTerm}
              handleAddArtist={handleAddArtist}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ModifyAlbum;
