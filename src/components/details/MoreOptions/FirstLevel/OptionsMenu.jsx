import React, { useRef, useEffect } from "react";

export const OptionsMenu = ({ isOpen, position, onClose, onAddToPlaylist }) => {
  if (!isOpen) return null;

  const menuRef = useRef(null);

  //Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* <div className="fixed inset-0 z-40" onClick={onClose} /> */}
      <div
        ref={menuRef}
        className="absolute z-50 bg-neutral-800 shadow-lg rounded-md py-1 min-w-[200px]"
        style={{ top: `${position.y}px`, right: `${position.x}px` }}
      >
        <button
          className="w-full text-left px-4 py-2 text-white hover:bg-neutral-700 flex items-center"
          onClick={onAddToPlaylist}
        >
          Add to playlist
        </button>
      </div>
    </>
  );
};
