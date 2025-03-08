import React, { useState, useEffect, useRef, useContext } from "react";
import { MoreOptionsButton } from "./MoreOptionsButton";
import { OptionsMenu } from "./FirstLevel/OptionsMenu";
import { PlaylistSelectionMenu } from "./SecondLevel/PlaylistSelectionMenu";

const SongOptionsMenu = ({ songId, songName, onSongRemove, hasPermission }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaylistMenuOpen, setIsPlaylistMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMoreOptionsClick = (e) => {
    e.stopPropagation();

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        x: rect.left,
        y: rect.bottom,
      });
      console.log("Position:", position);
    }

    setIsMenuOpen(true);
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsPlaylistMenuOpen(true);
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsPlaylistMenuOpen(false);
  };

  return (
    <div className="relative">
      <MoreOptionsButton
        ref={buttonRef}
        songId={songId}
        songName={songName}
        onClick={handleMoreOptionsClick}
      />

      <OptionsMenu
        isOpen={isMenuOpen}
        position={menuPosition}
        onClose={closeAllMenus}
        onAddToPlaylist={handleAddToPlaylist}
        onSongRemove={onSongRemove}
        hasPermission={hasPermission}
      />
      <PlaylistSelectionMenu
        isOpen={isPlaylistMenuOpen}
        position={menuPosition}
        onClose={closeAllMenus}
        songId={songId}
        songName={songName}
      />
    </div>
  );
};

export default SongOptionsMenu;
