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
import NoImage from "../../assets/noImage.jpg";

import {
  duration_to_str,
  duration_to_object,
  object_to_seconds,
} from "../Service/TimeService";
import { useNavigate } from "react-router-dom";

const ViewPlaylist = ({
  id,
  searchTerm,
  isAdd,
  isModify: initalIsModify,
  queue,
}) => {
  const navigate = useNavigate();
  const { userToken, isAdmin, getUserId } = useContext(AuthContext);
  const [isModify, setIsModify] = useState(initalIsModify);
  const [playlistCreator, setPlaylistCreator] = useState(null);
  const [visibility, setVisibility] = useState(null);

  useEffect(() => {
    if (!isAdmin()) {
      setIsModify(false);
    }
  }, []);

  const hasModifyPermission = () => {
    return isAdmin() || (playlistCreator && getUserId() == playlistCreator);
  };

  const switchModify = () => {
    setIsModify(!isModify);
  };

  const [markedToBeDeleted, setMarkedToBeDeleted] = useState(false);
  const [songsToBeDeleted, setSongsToBeDeleted] = useState(new Set());
  const [creators, setCreators] = useState([]);
  const [oldCreators, setOldCreators] = useState([]);
  const [songs, setSongs] = useState([]);
  const [addSongErrorMessage, setAddSongErrorMessage] = useState("");
  const [playlistView, setplaylistView] = useState(null);
  const [songsV, setSongsV] = useState(null);
  const [playlistUpdateSuccessMessage, setPlaylistUpdateSuccessMessage] =
    useState(null);
  const [playlistUpdateErrorMessage, setPlaylistUpdateErrorMessage] =
    useState(null);

  useEffect(() => {
    getData();
  }, [userToken]);

  const getData = async () => {
    //collection: response.name, response.year, response.id, response.artists: each .id, .imageLocation, .name
    //elements: response.songs.$values: for each .title, .duration, .positionInPlaylist, .playlistId, .artists: for each .id, .name, .imageLocation
    try {
      if (!id) {
        const emptyCollection = {
          type: "Playlist",
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
        setplaylistView(emptyCollection);
        return;
      }

      const response = await fetch(`${apiURL}/playlist/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (!response.ok) {
        return await response.text().then((errorMessage) => {
          throw new Error(
            `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
          );
        });
      }
      const data = await response.json();
      setVisibility(data.visibility);
      setPlaylistCreator(data.user.id);
      const collection = {
        type: "Playlist",
        id: data.id,
        name: data.name,
        description: data.description,
        image: data.image?.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(data.image.imageLocation)}`
          : NoImage,
        artists: [
          {
            id: data.user.id,
            name: data.user.displayName,
            imageLocation: data.user.imageLocation,
            creator_img: data.user.imageLocation
              ? `${apiURL}/image/${encodeURIComponent(artist.imageLocation)}`
              : NoImage,
          },
        ],
        details: {
          year: data.year,
          length: data.duration,
          song_count: data.songCount,
          total_length_str: duration_to_str(data.duration),
        },
        colors: {
          low: data.image?.lowColor,
          middle: data.image?.middleColor,
          top: data.image?.highColor,
        },
      };

      setplaylistView(collection);
      const mappedArtists = [
        {
          id: data.user.id,
          name: data.user.name,
          imageLocation: data.user.image.imageLocation,
          creator_img: data.user.image.imageLocation
            ? `${apiURL}/image/${encodeURIComponent(
                data.user.image.imageLocation
              )}`
            : NoImage,
        },
      ];

      setCreators(mappedArtists);
      setOldCreators(mappedArtists);

      const querriedSongs = data.songs.$values.map((song) => ({
        id: song.id,
        name: song.title,
        duration: song.duration,
        order: song.positionInAlbum,
        playlistId: song.playlistId,
        artists: song.artists.$values.map((artist) => ({
          id: artist.id,
          name: artist.name,
          image: artist.imageLocation
            ? `${apiURL}/image/${encodeURIComponent(artist.imageLocation)}`
            : NoImage,
        })),
      }));

      setSongs(querriedSongs.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!playlistView) {
      getData();
    }
  }, [playlistView, id]);

  const cardRef = useRef(null);

  const makeChange = async () => {
    setPlaylistUpdateErrorMessage(null);
    setPlaylistUpdateSuccessMessage(null);

    const playlistDTO = cardRef.current.getPlaylistInfoDTO();

    var playlistUpdateDTO = {
      name: null,
      file: null,
      description: null,
    };

    if (playlistDTO.name !== playlistView.name) {
      playlistUpdateDTO.name = playlistDTO.name;
    }
    if (playlistDTO.file !== null) {
      playlistUpdateDTO.file = playlistDTO.file;
    }
    if (playlistDTO.description !== playlistView.description) {
      playlistUpdateDTO.description = playlistDTO.description;
    }

    if (
      playlistUpdateDTO.name === null &&
      playlistUpdateDTO.file === null &&
      playlistUpdateDTO.description === null
    ) {
      throw new Error("No new data supplied! Playlist will not change!");
    }

    const endPoint = `${apiURL}/playlist/${encodeURIComponent(id)}/update`;

    const playlistFormData = new FormData();
    if (playlistUpdateDTO.name !== null) {
      playlistFormData.append("Name", playlistUpdateDTO.name);
    }
    if (playlistUpdateDTO.file !== null) {
      playlistFormData.append("Image", playlistUpdateDTO.file);
    }
    if (playlistUpdateDTO.description !== null) {
      playlistFormData.append("Description", playlistUpdateDTO.description);
    }

    const response = await fetch(endPoint, {
      method: "POST",
      body: playlistFormData,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      setPlaylistUpdateSuccessMessage("Playlist updated successfully!");
      await getData();
    } else {
      const errorData = await response.json();
      setPlaylistUpdateErrorMessage(errorData.title);
    }
  };

  const deletePlaylist = async () => {
    try {
      const endPoint = `${apiURL}/playlist/${encodeURIComponent(id)}/remove`;
      const response = await fetch(endPoint, {
        method: "POST",
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
      setPlaylistUpdateErrorMessage(error.message);
    }
  };

  const deleteItemFromList = async (itemId) => {
    try {
      const endpoint = `${apiURL}/playlist/${encodeURIComponent(
        id
      )}/remove-song`;
      var formData = new FormData();
      formData.append("SongId", itemId);
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.ok) {
        setSongs((prevSongs) => {
          const updatedSongs = prevSongs.filter((song) => song.id !== itemId);
          return updatedSongs;
        });
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

  const [showArtistSearch, setShowArtistSearch] = useState(false);
  const [currentSelectionFunc, setCurrentSelectionFunc] = useState(null);

  const searchRef = useRef(null);

  const handleAddArtist = (selectionFunc) => {
    setCurrentSelectionFunc(() => selectionFunc);
    setShowArtistSearch(true);
  };

  const playPlaylist = () => {
    queue.clear();
    songs.forEach((song) => {
      queue.add(song.id);
    });
  };

  return (
    <>
      <div className="w-full">
        <div className="overflow-y-hidden overflow-x-hidden scroll-smooth h-max items-center justify-center">
          {playlistView && (
            <CollectionDetailCard
              ref={cardRef}
              collection={playlistView}
              type="Playlist"
              isModify={isModify}
              creators={creators}
            />
          )}
          {playlistView && (
            <CollectionDetailActionBar
              middleColor={playlistView.colors?.middle || "#3a1e3c"}
              topColor={playlistView.colors?.top || "#2a162c"}
              isModify={isModify}
              toDelete={deletePlaylist}
              isAdd={isAdd}
              toSave={makeChange}
              switchParentIsModify={switchModify}
              hasModifyPermission={hasModifyPermission}
              playAlbum={playPlaylist}
            />
          )}
          {isModify && playlistUpdateSuccessMessage && (
            <div className="w-full flex flex-wrap items-center justify-center">
              <div className="font-bold text-white mt-2 mb-2 p-2 border-2 border-green-400 rounded-lg w-[50%] flex items-center justify-center">
                {playlistUpdateSuccessMessage}
              </div>
            </div>
          )}
          {isModify && playlistUpdateErrorMessage && (
            <div className="w-full flex flex-wrap items-center justify-center">
              <div className=" mt-2 mb-2 p-2 border-2 border-orange-500 rounded-lg w-[50] flex items-center justify-center">
                <span className="font-bold text-white text-center">
                  Playlist update error: {playlistUpdateErrorMessage}
                </span>
                .
              </div>
            </div>
          )}
          {songs && (
            <CollectionDetailList
              elements={songs}
              isModify={isModify}
              toDelete={deleteItemFromList}
              itemsToBeDeleted={songsToBeDeleted}
              searchTerm={searchTerm}
              parentType={"Playlist"}
              hasPermission={hasModifyPermission}
              queue={queue}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPlaylist;
