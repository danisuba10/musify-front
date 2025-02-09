import React, { useEffect } from "react";
import { useState, useRef } from "react";

import "../../../styles/details/CollectionDetailList.css";
import Duration from "../../../assets/duration.svg?react";
import DeleteButton from "../../../assets/delete.svg?react";
import Search from "../../search/Search";

import CollectionDetailListCard from "./CollectionDetailListCard";

const CollectionDetailList = ({
  elements,
  isModify,
  toDelete,
  itemsToBeDeleted,
  searchTerm,
}) => {
  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [currentSelectionFunc, setCurrentSelectionFunc] = useState(null);

  const searchRef = useRef(null);

  const handleAddArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    setShowArtistSearch(true);
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
      <div className="collection-list-container flex flex-col items-center justify-center">
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
        <div className="header-container">
          <div className="header-container-inside">
            <div className="left-container">
              <div className="left-container-element">#</div>
              <div className="left-container-element">Title</div>
            </div>
            <div className="right-container">
              <Duration className="duration-svg" />
            </div>
          </div>
        </div>
        <div className="list-container">
          {elements.map((element, index) => (
            <div key={index} className="list-row">
              <CollectionDetailListCard
                details={element}
                isModify={isModify}
                isMarkedForDelete={
                  itemsToBeDeleted && itemsToBeDeleted.has(element.id)
                }
                toDelete={() => toDelete(element.id)}
                onAddArtist={(selectionFunc) => handleAddArtist(selectionFunc)}
              />
            </div>
          ))}
          <div className="mt-16"></div>
        </div>
      </div>
    </>
  );
};

export default CollectionDetailList;
