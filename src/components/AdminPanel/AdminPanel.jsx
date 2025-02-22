import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import "../../styles/adminpanel/AdminPanel.css";
import AdminMenu from "./AdminMenu";
import AddArtist from "./AddArtist";
import AddAlbum from "./AddAlbum";
import ModifyAlbum from "./ModifyAlbum";
import { AuthContext } from "../auth/AuthProvider";

import { artist, songs } from "../../assets/Constants";

import Home from "../homepage/Home";
import ModifyArtist from "./ModifyArtist";

const AdminPanel = ({ searchTerm }) => {
  const navigate = useNavigate();

  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin()) {
    navigate("/");
    return null;
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
            <Route
              path="modify-artist"
              element={<ModifyArtist searchTerm={searchTerm} />}
            />
            <Route
              path="modify-album"
              element={<ModifyAlbum searchTerm={searchTerm} />}
            />
          </Routes>
        </div>
      </>
    );
  }
};

export default AdminPanel;
