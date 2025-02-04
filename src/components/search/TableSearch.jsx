import React, { useRef } from "react";
import { useState } from "react";

import "../../styles/searchbar/TableSearch.css";
import TableElementCard from "./TableElementCard";

const TableSearch = ({ title, type, elements }) => {
  const typeCSS = type === "circle" ? "rounded-full" : "";
  const containerRef = useRef(null);

  return (
    <>
      <div className="table-container">
        <div className="table-title">{title}</div>
        <div className="table-container group">
          <div ref={containerRef} className="table-element-container">
            {elements.map((card, index) => (
              <TableElementCard
                key={index}
                image={card.image}
                name={card.name}
                type={card.subtitle}
                typeCSS={typeCSS}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8"></div>
    </>
  );
};

export default TableSearch;
