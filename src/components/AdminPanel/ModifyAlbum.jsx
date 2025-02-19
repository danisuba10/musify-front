import React, { useState, useRef, useEffect } from "react";

import "../../styles/homepage/home.css";
import CollectionDetailCard from "../details/CollectionDetail/CollectionDetailCard";
import CollectionDetailActionBar from "../details/CollectionDetail/CollectionDetailActionBar";
import CollectionDetailList from "../details/CollectionDetail/CollectionDetailList";
import Search from "../search/Search";
import AddSong from "./AddSong";
import { artists, songs } from "../../assets/Constants";
import { apiURL } from "../../assets/Constants";

import {
  duration_to_str,
  duration_to_object,
  object_to_seconds,
} from "../Service/TimeService";

const ModifyAlbum = ({ id, searchTerm, isAdd, isModify }) => {
  const [markedToBeDeleted, setMarkedToBeDeleted] = useState(false);
  const [songsToBeDeleted, setSongsToBeDeleted] = useState(new Set());
  const [creators, setCreators] = useState([]);
  const [songs, setSongs] = useState([]);
  const [addSongErrorMessage, setAddSongErrorMessage] = useState("");
  const [albumView, setAlbumView] = useState(null);
  const [songsV, setSongsV] = useState(null);

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
      setCreators(
        data.artists.$values.map((artist) => ({
          id: artist.id,
          creator: artist.name,
          imageLocation: artist.imageLocation,
          creator_img: `${apiURL}/image/${encodeURIComponent(
            artist.imageLocation
          )}`,
        }))
      );

      const querriedSongs = data.songs.$values.map((song) => ({
        id: song.id,
        name: song.title,
        duration: song.duration,
        order: song.positionInAlbum,
        albumId: song.albumId,
        artists: song.artists.$values.map((artist) => ({
          id: artist.id,
          name: artist.name,
          imageLocation: artist.imageLocation,
        })),
      }));

      setSongs(querriedSongs.sort((a, b) => a.order - b.order));

      console.log(collection2);
      console.log(elements2);
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
  const makeChange = () => {
    const albumDTO = cardRef.current.getAlbumInfoDTO();
    const artistIds = creators.map((creator) => creator.id);

    const updateAlbumData = new FormData();
    updateAlbumData.append("Id", id);
    updateAlbumData.append("Name", albumDTO.name);
    updateAlbumData.append("Year", albumDTO.year);
    updateAlbumData.append("FormFile", albumDTO.file);
    updateAlbumData.append("ArtistIds", artistIds);
    console.log(updateAlbumData);
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
        console.log(artist);
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
    console.log(`Album artist with ID: ${creatorId} removed!`);
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
      <div className="detail-container">
        <div className="overflow-y-scroll overflow-x-hidden scroll-smooth h-full items-center justify-center">
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
              type="album"
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

export default ModifyAlbum;
