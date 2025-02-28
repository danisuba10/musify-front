import React, { useState, useRef, useEffect, useContext } from "react";

import "../../styles/homepage/home.css";
import CollectionDetailCard from "../details/CollectionDetail/CollectionDetailCard";
import CollectionDetailActionBar from "../details/CollectionDetail/CollectionDetailActionBar";
import CollectionDetailList from "../details/CollectionDetail/CollectionDetailList";
import Search from "../search/Search";
import AddSong from "./AddSong";
import { AuthContext } from "../auth/AuthProvider";
import { artists, songs } from "../../assets/Constants";
import { apiURL } from "../../assets/Constants";

import {
  duration_to_str,
  duration_to_object,
  object_to_seconds,
} from "../Service/TimeService";

const ViewAlbum = ({ id, searchTerm, isAdd, isModify }) => {
  const { userToken } = useContext(AuthContext);
  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin()) {
    isModify = false;
  }

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

  const getData = async () => {
    //collection: response.name, response.year, response.id, response.artists: each .id, .imageLocation, .name
    //elements: response.songs.$values: for each .title, .duration, .positionInAlbum, .albumId, .artists: for each .id, .name, .imageLocation
    try {
      console.log("Get data called!");

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

      const response = await fetch(`${apiURL}/album/${id}`);
      console.log(response);
      const data = await response.json();

      const collection = {
        type: "Album",
        id: data.id,
        name: data.name,
        image: `${apiURL}/image/${encodeURIComponent(
          data.image.imageLocation
        )}`,
        artists: data.artists.$values.map((artist) => ({
          id: artist.id,
          name: artist.name,
          imageLocation: artist.imageLocation,
          creator_img: `${apiURL}/image/${encodeURIComponent(
            artist.imageLocation
          )}`,
        })),
        details: {
          year: data.year,
          length: data.duration,
          song_count: data.songCount,
          total_length_str: "0",
        },
        colors: {
          low: data.image.lowColor,
          middle: data.image.middleColor,
          top: data.image.highColor,
        },
      };

      setAlbumView(collection);
      const mappedArtists = data.artists.$values.map((artist) => ({
        id: artist.id,
        creator: artist.name,
        imageLocation: artist.imageLocation,
        creator_img: `${apiURL}/image/${encodeURIComponent(
          artist.imageLocation
        )}`,
      }));

      setCreators(mappedArtists);
      setOldCreators(mappedArtists);

      const querriedSongs = data.songs.$values.map((song) => ({
        id: song.id,
        name: song.title,
        duration: song.duration,
        order: song.positionInAlbum,
        albumId: song.albumId,
        artists: song.artists.$values.map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: `${apiURL}/image/${encodeURIComponent(artist.imageLocation)}`,
        })),
      }));

      setSongs(querriedSongs.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setSongs((prevSongs) => [...prevSongs].sort((a, b) => a.order - b.order));
  // }, [songs]);

  useEffect(() => {
    if (!albumView) {
      console.log("Triggering getData");
      getData();
    } else {
      console.log("Id is :", id);
      console.log("AlbumView is already set or no valid id");
    }
  }, [albumView, id]);

  const cardRef = useRef(null);

  const makeChange = async () => {
    setAlbumUpdateErrorMessage(null);
    setAlbumUpdateSuccessMessage(null);

    const albumDTO = cardRef.current.getAlbumInfoDTO();
    const oldArtistIds = oldCreators.map((creator) => creator.id);
    const artistIds = creators.map((creator) => creator.id);

    console.log("AlbumDTO: ", albumDTO);
    var albumUpdateDTO = {
      name: null,
      year: null,
      file: null,
      artistIds: null,
    };

    console.log("New artistIDS: ", artistIds);
    console.log("Old artistIDS: ", oldArtistIds);
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

    console.log("Artist ids after convert:", albumUpdateDTO.artistIds);

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
    console.log(albumFormData);

    const response = await fetch(endPoint, {
      method: "POST",
      body: albumFormData,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      console.log("Album updated successfully!");
      setAlbumUpdateSuccessMessage("Album updated successfully!");
    } else {
      const errorData = await response.json();
      console.log("Error data: ", errorData);
      console.log("Error data title:", errorData.title);
      setAlbumUpdateErrorMessage(errorData.title);
    }
  };

  const deleteAlbum = () => {
    console.log(`Album marked to be deleted: ${!markedToBeDeleted}`);
    setMarkedToBeDeleted(!markedToBeDeleted);
  };

  const deleteItemFromList = (itemId) => {
    setSongsToBeDeleted((prevSongs) => {
      const updatedSongs = new Set(prevSongs);
      if (prevSongs.has(itemId)) {
        updatedSongs.delete(itemId);
      } else {
        updatedSongs.add(itemId);
      }
      return updatedSongs;
    });
  };

  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [currentSelectionFunc, setCurrentSelectionFunc] = useState(null);

  const searchRef = useRef(null);

  const handleAddArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    setShowArtistSearch(true);
  };

  const handleAddAlbumArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    setShowArtistSearch(true);
  };

  const addAlbumArtist = (artist) => {
    setCreators((prevCreators) => {
      const artistExists = prevCreators.some(
        (creator) => creator.id === artist.id
      );
      if (!artistExists) {
        console.log(`Album artist added: ${artist.name} (${artist.id})`);
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
  };

  const deleteCreator = (id) => {
    setCreators((prevCreators) =>
      prevCreators.filter((creator) => creator.id !== id)
    );
    console.log(`Album artist with ID: ${id} removed!`);
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

    setSongs((prevSongs) => [...prevSongs, songDTO]);
    setAddSongErrorMessage("");
  };

  return (
    <>
      <div className="w-full">
        <div className="overflow-y-hidden overflow-x-hidden scroll-smooth h-max items-center justify-center">
          {showArtistSearch && (
            <div ref={searchRef} className="w-[95%]">
              <Search
                initialTerm={searchTerm}
                selectionFunc={(artist) => {
                  if (currentSelectionFunc) {
                    currentSelectionFunc(artist);
                  }
                  setShowArtistSearch(false);
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
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAlbum;
