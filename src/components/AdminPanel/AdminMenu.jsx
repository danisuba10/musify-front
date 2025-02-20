import React from "react";

import "../../styles/adminpanel/AdminMenu.css";
import { useNavigate } from "react-router-dom";

const AdminMenu = () => {
  const navigate = useNavigate();

  const addArtistRedir = () => {
    navigate("/admin/add-artist");
  };
  const addAlbumRedir = () => {
    navigate("/admin/add-album");
  };
  const modifyAlbumRedir = () => {
    navigate("/admin/modify-album");
  };
  return (
    <>
      <div className="admin-menu-container">
        <button className="admin-menu-button" onClick={addArtistRedir}>
          <span className="admin-menu-entry">Add artist</span>
        </button>
        <button className="admin-menu-button" onClick={addAlbumRedir}>
          <span className="admin-menu-entry">Add album</span>
        </button>
        <button className="admin-menu-button">
          <span className="admin-menu-entry">Modify artist</span>
        </button>
        <button className="admin-menu-button" onClick={modifyAlbumRedir}>
          <span className="admin-menu-entry">Modify album</span>
        </button>
      </div>
    </>
  );
};

export default AdminMenu;
