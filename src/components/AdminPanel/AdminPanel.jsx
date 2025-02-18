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
            <Route
              path="add-album"
              element={<AddAlbum searchTerm={searchTerm} />}
            />
            {/* <Route path="modify-artist" /> */}
            <Route
              path="modify-album"
              element={
                <ModifyAlbum
                  id={"05ec2d57-5c12-4487-b49b-4a03a077954d"}
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
