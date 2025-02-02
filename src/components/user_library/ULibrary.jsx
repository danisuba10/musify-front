import React from "react";
import VerticalScrollGrid from "./VerticalScrollGrid";
import { library } from "../../assets/Constants";
import "../../styles/library/library.css";

export default function UserLibrary() {
  return (
    <div className="library-container">
      <VerticalScrollGrid title="Library" cards={library} />
    </div>
  );
}
