import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";

import "../../styles/homepage/home.css";
import CollectionDetailCard from "../details/CollectionDetail/CollectionDetailCard";
import CollectionDetailActionBar from "../details/CollectionDetail/CollectionDetailActionBar";
import CollectionDetailList from "../details/CollectionDetail/CollectionDetailList";
import Search from "../search/Search";
import AddSong from "./AddSong";
import { AuthContext } from "../auth/AuthProvider";
import { artists, songs } from "../../assets/Constants";
import { apiURL } from "../../assets/Constants";
import NoImage from "../../assets/noImage.jpg";

import {
  duration_to_str,
  duration_to_object,
  object_to_seconds,
} from "../Service/TimeService";
import { useNavigate } from "react-router-dom";

// Cache key generation function
const generateCacheKey = (id) => `album_data_${id}`;

const ViewAlbum = ({
  id,
  searchTerm,
  isAdd,
  isModify,
  switchModify,
  queue,
}) => {
  const navigate = useNavigate();
  const isPageReloaded = () => {
    const savedSearchVisibility = JSON.parse(
      localStorage.getItem("showArtistSearch")
    );

    if (
      window.performance &&
      window.performance.getEntriesByType &&
      savedSearchVisibility !== true
    ) {
      const navEntries = window.performance.getEntriesByType("navigation");
      if (navEntries.length > 0 && navEntries[0].type === "reload") {
        return true;
      }
    }
    return false;
  };

  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const { userToken } = useContext(AuthContext);
  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin()) {
    isModify = false;
  }

  const hasModifyPermission = () => {
    return isAdmin() && isModify === true;
  };

  const [markedToBeDeleted, setMarkedToBeDeleted] = useState(false);
  const [songsToBeDeleted, setSongsToBeDeleted] = useState(new Set());
  const [creators, setCreators] = useState([]);
  const [oldCreators, setOldCreators] = useState([]);
  const [songs, setSongs] = useState([]);
  const [addSongErrorMessage, setAddSongErrorMessage] = useState("");
  const [albumView, setAlbumView] = useState(null);
  const [songsV, setSongsV] = useState(null);
  const [albumUpdateSuccessMessage, setAlbumUpdateSuccessMessage] =
    useState(null);
  const [albumUpdateErrorMessage, setAlbumUpdateErrorMessage] = useState(null);

  // Add a ref to track if data has been fetched for current ID
  const lastFetchedIdRef = useRef(null);
  // Add a state to track if data is being loaded
  const [isLoading, setIsLoading] = useState(false);

  const getData = async (forceRefresh = false) => {
    if (isPageReloaded()) {
      forceRefresh = true;
    }

    try {
      if (!id) {
        const emptyCollection = {
          type: "Album",
          id: null,
          name: "",
          image: "",
          artists: [],
          details: {
            year: 0,
            length: 0,
            song_count: 0,
            total_length_str: "0",
          },
          colors: {
            low: "#A192B4",
            middle: "#685E74",
            top: "#4B4454",
          },
        };
        setAlbumView(emptyCollection);
        return;
      }

      // Check if we already have data for this ID in memory
      if (id === lastFetchedIdRef.current && albumView && !forceRefresh) {
        return;
      }

      // Check if we have cached data in localStorage
      const cacheKey = generateCacheKey(id);
      const cachedData = !forceRefresh ? localStorage.getItem(cacheKey) : null;

      if (cachedData && !forceRefresh) {
        const { albumData, songsData, artistsData, oldArtistsData } =
          JSON.parse(cachedData);

        setAlbumView(albumData);
        setSongs(songsData);
        setCreators(artistsData);
        setOldCreators(oldArtistsData);
        lastFetchedIdRef.current = id;
        return;
      }

      // If no cached data or force refresh, fetch from API
      setIsLoading(true);
      const response = await fetch(`${apiURL}/album/${id}`);
      const data = await response.json();

      const collection = {
        type: "Album",
        id: data.id,
        name: data.name,
        image: data.image.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(data.image.imageLocation)}`
          : NoImage,
        artists: data.artists.$values.map((artist) => ({
          id: artist.id,
          name: artist.name,
          imageLocation: artist.imageLocation,
          creator_img: artist.imageLocation
            ? `${apiURL}/image/${encodeURIComponent(artist.imageLocation)}`
            : NoImage,
        })),
        details: {
          year: data.year,
          length: data.duration,
          song_count: data.songCount,
          total_length_str: duration_to_str(data.duration),
        },
        colors: {
          low: data.image.lowColor,
          middle: data.image.middleColor,
          top: data.image.highColor,
        },
      };

      const mappedArtists = data.artists.$values.map((artist) => ({
        id: artist.id,
        creator: artist.name,
        imageLocation: artist.imageLocation,
        creator_img: artist.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(artist.imageLocation)}`
          : NoImage,
      }));

      const querriedSongs = data.songs.$values.map((song) => ({
        id: song.id,
        name: song.title,
        duration: song.duration,
        order: song.positionInAlbum,
        albumId: song.albumId,
        artists: song.artists.$values.map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: artist.imageLocation
            ? `${apiURL}/image/${encodeURIComponent(artist.imageLocation)}`
            : NoImage,
        })),
      }));

      const sortedSongs = querriedSongs.sort((a, b) => a.order - b.order);

      // Update state with fetched data
      setAlbumView(collection);
      setCreators(mappedArtists);
      setOldCreators(mappedArtists);
      setSongs(sortedSongs);

      // Cache the data in localStorage
      const cacheData = {
        albumData: collection,
        songsData: sortedSongs,
        artistsData: mappedArtists,
        oldArtistsData: mappedArtists,
        timestamp: Date.now(),
      };

      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      lastFetchedIdRef.current = id;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to refresh data when needed
  const refreshData = () => {
    getData(true);
  };

  useEffect(() => {
    // Only fetch data if we don't have it for the current ID
    if (id !== lastFetchedIdRef.current || !albumView) {
      getData();
    }

    // Cleanup function to invalidate cache after a certain time
    return () => {
      // Optional: Clean up old cache entries
      const cleanupCache = () => {
        const now = Date.now();
        // Expire cache items older than 1 hour
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("album_data_")) {
            try {
              const data = JSON.parse(localStorage.getItem(key));
              if (data.timestamp && now - data.timestamp > 60 * 60 * 1000) {
                localStorage.removeItem(key);
              }
            } catch (e) {
              // Invalid JSON, remove the item
              localStorage.removeItem(key);
            }
          }
        });
      };

      cleanupCache();
    };
  }, [id]);

  const cardRef = useRef(null);

  const makeChange = async () => {
    setAlbumUpdateErrorMessage(null);
    setAlbumUpdateSuccessMessage(null);

    const albumDTO = cardRef.current.getAlbumInfoDTO();
    const oldArtistIds = oldCreators.map((creator) => creator.id);
    const artistIds = creators.map((creator) => creator.id);

    var albumUpdateDTO = {
      name: null,
      year: null,
      file: null,
      artistIds: null,
    };

    if (albumDTO.name !== albumView.name) {
      albumUpdateDTO.name = albumDTO.name;
    }
    if (albumDTO.year !== albumView.details.year) {
      albumUpdateDTO.year = albumDTO.year;
    }
    if (albumDTO.file !== null) {
      albumUpdateDTO.file = albumDTO.file;
    }
    if (
      !(
        artistIds.length === oldArtistIds.length &&
        artistIds.every((id, index) => id === oldArtistIds[index])
      )
    ) {
      albumUpdateDTO.artistIds = artistIds;
    }

    if (
      albumUpdateDTO.name === null &&
      albumUpdateDTO.year === null &&
      albumUpdateDTO.file === null &&
      albumUpdateDTO.artistIds === null
    ) {
      throw new Error("No new data supplied! Album will not change!");
    }

    var endPoint;
    if (isAdd) {
      endPoint = `${apiURL}/album/add-album`;
    } else {
      endPoint = `${apiURL}/album/update-album`;
    }

    const albumFormData = new FormData();
    if (!isAdd && id) {
      albumFormData.append("Id", id);
    }
    if (albumUpdateDTO.name !== null) {
      albumFormData.append("Name", albumUpdateDTO.name);
    }
    if (albumUpdateDTO.year !== null) {
      albumFormData.append("Year", albumUpdateDTO.year);
    }
    if (albumUpdateDTO.file !== null) {
      albumFormData.append("FormFile", albumUpdateDTO.file);
    }
    if (albumUpdateDTO.artistIds !== null) {
      albumUpdateDTO.artistIds.forEach((artistId) => {
        albumFormData.append("ArtistIds", artistId);
      });
    }

    try {
      const response = await fetch(endPoint, {
        method: "POST",
        body: albumFormData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setAlbumUpdateSuccessMessage("Album updated successfully!");

        // Clear the cache after successful update
        if (id) {
          localStorage.removeItem(generateCacheKey(id));
        }

        // Force refresh data after successful update
        refreshData();
      } else {
        const errorData = await response.json();
        console.log("Error data: ", errorData);
        console.log("Error data title:", errorData.title);
        setAlbumUpdateErrorMessage(errorData.title);
      }
    } catch (error) {
      console.error("Error updating album:", error);
      setAlbumUpdateErrorMessage("Network error. Please try again.");
    }
  };

  const deleteAlbum = async () => {
    try {
      const endPoint = `${apiURL}/album/${encodeURIComponent(id)}`;
      const response = await fetch(endPoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.ok) {
        navigate("/");
      } else {
        return await response.text().then((errorMessage) => {
          throw new Error(
            errorMessage ?? "Error occured when deleting playlist!"
          );
        });
      }
    } catch (error) {
      setAlbumUpdateErrorMessage(error.message);
    }
  };

  const deleteItemFromList = async (itemId) => {
    try {
      const endpoint = `${apiURL}/song/${encodeURIComponent(itemId)}`;
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setSongs((prevSongs) => {
          const updatedSongs = prevSongs.filter((song) => song.id !== itemId);
          return updatedSongs;
        });

        // Update the cache with the modified songs list
        if (id) {
          const cacheKey = generateCacheKey(id);
          const cachedData = localStorage.getItem(cacheKey);

          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            parsedData.songsData = parsedData.songsData.filter(
              (song) => song.id !== itemId
            );
            localStorage.setItem(
              cacheKey,
              JSON.stringify({
                ...parsedData,
                timestamp: Date.now(),
              })
            );
          }
        }
      } else {
        return await response.text().then((errorMessage) => {
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
          );
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [currentSelectionFunc, setCurrentSelectionFunc] = useState(null);

  const searchRef = useRef(null);

  const toggleArtistSearch = useCallback(
    (show) => {
      setShowArtistSearch(show);
      localStorage.setItem("showArtistSearch", JSON.stringify(show));
    },
    [id]
  );

  useEffect(() => {
    const savedSearchVisibility = JSON.parse(
      localStorage.getItem("showArtistSearch")
    );
    if (savedSearchVisibility !== null) {
      setShowArtistSearch(savedSearchVisibility);
    } else {
      toggleArtistSearch(false);
    }

    const savedFunction = localStorage.getItem("currentSelectionFunc");

    if (savedFunction) {
      if (savedFunction === "addAlbumArtist") {
        setCurrentSelectionFunc(() => addAlbumArtist);
      }
    }
  }, []);

  const handleAddArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    toggleArtistSearch(true);
  };

  const handleAddAlbumArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    localStorage.setItem("currentSelectionFunc", "addAlbumArtist");
    toggleArtistSearch(true);
  };

  const addAlbumArtist = (artist) => {
    setCreators((prevCreators) => {
      const artistExists = prevCreators.some(
        (creator) => creator.id === artist.id
      );
      if (!artistExists) {
        return [
          ...prevCreators,
          {
            id: artist.id,
            creator: artist.name,
            creator_img: artist.image || "",
          },
        ];
      }
      return prevCreators;
    });

    // Update the cache when artists are added
    if (id) {
      const cacheKey = generateCacheKey(id);
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);

        // Update the cached creators data
        const updatedCreators = [...creators];
        const artistExists = updatedCreators.some(
          (creator) => creator.id === artist.id
        );

        if (!artistExists) {
          updatedCreators.push({
            id: artist.id,
            creator: artist.name,
            creator_img: artist.image || "",
          });
        }

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            ...parsedData,
            artistsData: updatedCreators,
            timestamp: Date.now(),
          })
        );
      }
    }
  };

  const deleteCreator = (id) => {
    setCreators((prevCreators) =>
      prevCreators.filter((creator) => creator.id !== id)
    );

    // Update the cache when artists are removed
    if (id) {
      const cacheKey = generateCacheKey(id);
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        parsedData.artistsData = parsedData.artistsData.filter(
          (creator) => creator.id !== id
        );

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            ...parsedData,
            timestamp: Date.now(),
          })
        );
      }
    }
  };

  const closeSearch = () => {
    setShowArtistSearch(false);
  };

  useEffect(() => {
    if (showArtistSearch && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showArtistSearch]);

  const parseToNumber = (value) => {
    const number = parseInt(value, 10);
    return isNaN(number) ? 0 : number;
  };

  const addSong = (data) => {
    const newSongOrder = data.get("songOrder");
    const songExists = songs.some(
      (song) => parseToNumber(song.order) === parseToNumber(newSongOrder)
    );

    if (songExists) {
      setAddSongErrorMessage(
        `A song with order ${newSongOrder} already exists.`
      );
      return;
    }

    var songDTO = {
      albumId: id,
      name: data.get("songName"),
      order: newSongOrder,
      duration: object_to_seconds({
        hours: parseToNumber(data.get("songDurationHours")),
        minutes: parseToNumber(data.get("songDurationMinutes")),
        seconds: parseToNumber(data.get("songDurationSeconds")),
      }),
      artists: [],
    };

    if (creators.length == 1) {
      songDTO.mainArtist = {
        name: creators[0].creator,
        image: creators[0].creator_img,
        id: creators[0].id,
      };
    }

    setSongs((prevSongs) => {
      const updatedSongs = [...prevSongs, songDTO];

      // Update the cache with the new song added
      if (id) {
        const cacheKey = generateCacheKey(id);
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          parsedData.songsData = updatedSongs;

          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              ...parsedData,
              timestamp: Date.now(),
            })
          );
        }
      }

      return updatedSongs;
    });

    setAddSongErrorMessage("");
  };

  const playAlbum = () => {
    queue.clear();
    songs.forEach((song) => {
      queue.add(song.id);
    });
  };

  const addToQueueAlbum = () => {
    songs.forEach((song) => {
      queue.add(song.id);
    });
  };

  return (
    <>
      <div
        className="w-full"
        style={{
          backgroundImage: "linear-gradient(to right, #191910, #191912)",
        }}
      >
        <div className="overflow-y-hidden overflow-x-hidden scroll-smooth h-max items-center justify-center">
          {isLoading && (
            <div className="w-full flex justify-center my-4">
              <p className="text-white">Loading album data...</p>
            </div>
          )}

          {showArtistSearch && currentSelectionFunc && (
            <div ref={searchRef} className="w-[95%]">
              <Search
                initialTerm={searchTerm}
                selectionFunc={(artist) => {
                  if (currentSelectionFunc) {
                    currentSelectionFunc(artist);
                  }
                  toggleArtistSearch(false);
                }}
                defaultFilter="Artists"
                onlyFilter={true}
              />
            </div>
          )}
          {albumView && (
            <CollectionDetailCard
              ref={cardRef}
              collection={albumView}
              type="Album"
              isModify={isModify}
              creators={creators}
              onAddArtist={() => handleAddAlbumArtist(addAlbumArtist)}
              onDeleteArtist={deleteCreator}
            />
          )}
          {albumView && (
            <CollectionDetailActionBar
              middleColor={albumView.colors?.middle || "#3a1e3c"}
              topColor={albumView.colors?.top || "#2a162c"}
              isModify={isModify}
              toDelete={deleteAlbum}
              isAdd={isAdd}
              toSave={makeChange}
              hasModifyPermission={isAdmin}
              switchParentIsModify={switchModify}
              playAlbum={playAlbum}
              addToQueueAlbum={addToQueueAlbum}
            />
          )}
          {isModify && albumUpdateSuccessMessage && (
            <div className="w-full flex flex-wrap items-center justify-center">
              <div className="font-bold text-white mt-2 mb-2 p-2 border-2 border-green-400 rounded-lg w-[50%] flex items-center justify-center">
                {albumUpdateSuccessMessage}
              </div>
            </div>
          )}
          {isModify && albumUpdateErrorMessage && (
            <div className="w-full flex flex-wrap items-center justify-center">
              <div className=" mt-2 mb-2 p-2 border-2 border-orange-500 rounded-lg w-[50] flex items-center justify-center">
                <span className="font-bold text-white text-center">
                  Album update error: {albumUpdateErrorMessage}
                </span>
                .
              </div>
            </div>
          )}
          {isModify && (
            <>
              <div className="mt-8 w-full"></div>
              <div className="w-full flex flex-col justify-center items-center">
                {addSongErrorMessage && (
                  <div className="font-bold text-white mt-2 mb-2 p-2 border-2 border-orange-500 rounded-lg">
                    Error: {addSongErrorMessage}
                  </div>
                )}
                <AddSong handleSubmit={addSong} />
              </div>
              <div className="mt-8 w-full"></div>
            </>
          )}
          {songs && (
            <CollectionDetailList
              elements={songs}
              isModify={isModify}
              toDelete={deleteItemFromList}
              itemsToBeDeleted={songsToBeDeleted}
              searchTerm={searchTerm}
              handleAddArtist={handleAddArtist}
              parentType={"Album"}
              hasPermission={hasModifyPermission}
              queue={queue}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAlbum;
