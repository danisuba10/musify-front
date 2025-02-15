import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../../styles/adminpanel/AdminPanel.css";
import AdminMenu from "./AdminMenu";
import AddArtist from "./AddArtist";
import AddAlbum from "./AddAlbum";
import ModifyAlbum from "./ModifyAlbum";
import { AuthContext } from "../auth/AuthProvider";

import { artist, songs } from "../../assets/Constants";

import Home from "../homepage/Home";

const AdminPanel = ({ searchTerm }) => {
  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin()) {
    return <Home />;
  } else {
    return (
      <>
        <div className="admin-panel-container">
          <Routes>
            <Route path="" element={<AdminMenu />} />
            <Route path="add-artist" element={<AddArtist />} />
            <Route path="add-album" element={<AddAlbum />} />
            {/* <Route path="modify-artist" /> */}
            <Route
              path="modify-album"
              element={
                <ModifyAlbum
                  collection={artist}
                  elements={songs}
                  searchTerm={searchTerm}
                />
              }
            />
          </Routes>
        </div>
      </>
    );
  }
};

export default AdminPanel;
