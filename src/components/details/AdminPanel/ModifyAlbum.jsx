import React, { useState } from "react";

import "../../../styles/homepage/home.css";
import CollectionDetailCard from "../CollectionDetail/CollectionDetailCard";
import CollectionDetailActionBar from "../CollectionDetail/CollectionDetailActionBar";
import CollectionDetailList from "../CollectionDetail/CollectionDetailList";

const ModifyAlbum = ({ id, collection, elements, searchTerm }) => {
  const [markedToBeDeleted, setMarkedToBeDeleted] = useState(false);
  const [songsToBeDeleted, setSongsToBeDeleted] = useState(new Set());

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

  return (
    <>
      <div className="detail-container">
        <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full">
          <CollectionDetailCard
            collection={collection}
            type="album"
            isModify={true}
          />
          <CollectionDetailActionBar
            middleColor={collection.colors.middle}
            topColor={collection.colors.top}
            isModify={true}
            toDelete={deleteAlbum}
          />
          <CollectionDetailList
            elements={elements}
            isModify={true}
            toDelete={deleteItemFromList}
            itemsToBeDeleted={songsToBeDeleted}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </>
  );
};

export default ModifyAlbum;
