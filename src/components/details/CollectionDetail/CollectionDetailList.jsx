import React from "react";

import "../../../styles/details/CollectionDetailList.css";
import Duration from "../../../assets/duration.svg?react";
import CollectionDetailListCard from "./CollectionDetailListCard";

const CollectionDetailList = ({ elements }) => {
  return (
    <>
      <div className="collection-list-container">
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
              <CollectionDetailListCard details={element} />
            </div>
          ))}
          <div className="mt-16"></div>
        </div>
      </div>
    </>
  );
};

export default CollectionDetailList;
