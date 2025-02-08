import React from "react";

import "../../../styles/adminpanel/AdminMenu.css";

const AdminMenu = () => {
  const addArtistRedir = () => {
    window.location.href = "/admin/add-artist";
  };
  const addAlbumRedir = () => {
    window.location.href = "/admin/add-album";
  };
  const modifyAlbumRedir = () => {
    window.location.href = "/admin/modify-album";
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
