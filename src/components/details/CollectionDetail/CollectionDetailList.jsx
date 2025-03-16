import React, { useEffect } from "react";
import { useState, useRef } from "react";

import "../../../styles/details/CollectionDetailList.css";
import Duration from "../../../assets/duration.svg?react";
import Search from "../../search/Search";

import CollectionDetailListCard from "./CollectionDetailListCard";

const CollectionDetailList = ({
  elements,
  isModify,
  toDelete,
  itemsToBeDeleted,
  handleAddArtist,
  parentType,
  hasPermission,
  queue,
}) => {
  const [songErrorMessage, setSongErrorMessage] = useState(null);
  const [songSuccessMessage, setSongSuccessMessage] = useState(null);

  return (
    <>
      <div className="collection-list-container flex flex-col items-center justify-center">
        {songErrorMessage && (
          <div className="text-white font-bold border-2 border-orange-500 p-2 rounded-3xl mt-4">
            {songErrorMessage}
          </div>
        )}
        {songSuccessMessage && (
          <div className="text-white font-bold border-2 border-green-400 p-2 rounded-3xl mt-4">
            {songSuccessMessage}
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
                onAddArtist={
                  handleAddArtist
                    ? (selectionFunc) => handleAddArtist(selectionFunc)
                    : null
                }
                parentType={parentType}
                setErrorMessage={setSongErrorMessage}
                setSuccessMessage={setSongSuccessMessage}
                hasPermission={hasPermission}
                queue={queue}
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
