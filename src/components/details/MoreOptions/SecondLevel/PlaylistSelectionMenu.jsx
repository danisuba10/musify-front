import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../../auth/AuthProvider";
import { apiURL } from "../../../../assets/Constants";
import { debounce } from "../../../Service/Debounce";

export const PlaylistSelectionMenu = ({
  isOpen,
  position,
  onClose,
  songId,
  songName,
}) => {
  const { userToken, userId } = useContext(AuthContext);
  const [playlists, setPlaylists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);
  const [adjustedPosition, setAdjustedPosition] = useState({
    x: position.x,
    y: position.y,
  });

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

  useEffect(() => {
    if (isOpen) {
      fetchTopPlaylists();
    }
  }, [isOpen]);

  const fetchTopPlaylists = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiURL}/user/playlists`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to search playlists");
      }

      const data = await response.json();
      console.log(data);
      const playlists_l = data.$values.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        image: `${apiURL}/image/${encodeURIComponent(
          playlist.image?.imageLocation
        )}`,
      }));
      setPlaylists(playlists_l);
    } catch (err) {
      setError(err.message);
      console.error("Error getting user's top playlists!:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPlaylists = async (term) => {
    if (term.trim() === "") {
      fetchTopPlaylists();
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${apiURL}/user/search-playlists?term=${encodeURIComponent(term)}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to search playlists");
      }

      const data = await response.json();
      console.log(data);
      const playlists_l = data.$values.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        image: `${apiURL}/image/${encodeURIComponent(
          playlist.image?.imageLocation
        )}`,
      }));
      setPlaylists(playlists_l);
    } catch (err) {
      setError(err.message);
      console.error("Error searching playlists:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchPlaylists(value);
  };

  const debouncedSearchPlaylists = debounce(async (value) => {
    await searchPlaylists(value);
  }, 250);

  const createNewPlaylist = async () => {
    try {
      var formData = new FormData();
      formData.append("Name", songName);
      formData.append("Description", "");
      formData.append("FirstSongId", songId);
      formData.append("Visibility", "Private");

      const createResponse = await fetch(`${apiURL}/playlist/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create playlist");
      }

      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Error creating playlist:", err);
    }
  };

  const addSongToPlaylist = async (playlistId) => {
    try {
      var formData = new FormData();
      formData.append("SongId", songId);

      const response = await fetch(
        `${apiURL}/playlist/${playlistId}/add-song`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (!response.ok) {
        console.log(response);
        throw new Error(await response.text());
      }

      alert("Song added to playlist successfully");
      onClose();
    } catch (err) {
      setError(err.message);
      console.error("Error adding song to playlist:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* <div className="fixed inset-0 z-40" onClick={onClose} /> */}
      <div
        ref={menuRef}
        className="absolute z-50 bg-neutral-800 shadow-lg rounded-md py-1 min-w-[280px] max-h-[400px] overflow-y-auto"
        style={{
          top: `${adjustedPosition.y - 400}px`,
          left: `${adjustedPosition.x - 300}px`,
        }}
      >
        <div className="flex justify-between items-center px-4 py-2 border-b border-neutral-700">
          <h3 className="text-white font-semibold">Add to Playlist</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-4 py-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search playlist"
            className="w-full bg-neutral-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
          ></input>
        </div>

        <div className="border-b border-neutral-700">
          <button
            onClick={createNewPlaylist}
            className="w-full text-left px-4 py-3 text-white hover:bg-neutral-700 flex items-center"
          >
            <div className="w-10 h-10 bg-neutral-600 flex items-center justify-center rounded mr-3">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span>Create New Playlist</span>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-4 text-neutral-400">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-400">{error}</div>
        ) : playlists?.length === 0 ? (
          <div className="text-center py-4 text-neutral-400">
            No playlists found
          </div>
        ) : (
          <div>
            {playlists?.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => addSongToPlaylist(playlist.id)}
                className="w-full text-left px-4 py-3 text-white hover:bg-neutral-700 flex items-center"
              >
                <div className="w-10 h-10 bg-neutral-600 mr-3 overflow-hidden rounded">
                  {playlist.image ? (
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-700"></div>
                  )}
                </div>
                <span className="truncate">{playlist.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
