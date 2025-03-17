import React, { useContext, useEffect, useState } from "react";
import { apiURL } from "../../assets/Constants";

import ProfileDetail from "../details/ProfileDetail/ProfileDetail";
import { AuthContext } from "../auth/AuthProvider";

const ViewArtist = ({
  id,
  isModify = false,
  setErrorMessage = () => {},
  setSuccessMessage = () => {},
}) => {
  const { userToken } = useContext(AuthContext);

  if (!userToken) {
    isModify = false;
  }

  const [artistView, setArtistView] = useState(null);

  const fetchData = async () => {
    if (!id) {
      const emptyCollection = {
        type: "Artist",
        id: null,
        name: "",
        image: "",
        details: {
          monthly_listeners: 0,
        },
        colors: {
          low: "#A192B4",
          middle: "#685E74",
          top: "#4B4454",
        },
      };
      setArtistView(emptyCollection);
      return;
    }

    const response = await fetch(`${apiURL}/artist/${id}`);
    const data = await response.json();

    const collection = {
      type: "Artist",
      id: data.id,
      name: data.name,
      image: `${apiURL}/image/${encodeURIComponent(data.image.imageLocation)}`,
      details: {
        monthly_listeners: 0,
      },
      colors: {
        low: data.image.lowColor,
        middle: data.image.middleColor,
        top: data.image.highColor,
      },
      albums: data.topAlbums.$values.map((album) => ({
        type: "Album",
        id: album.id,
        name: album.name,
        image: `${apiURL}/image/${encodeURIComponent(album.imageLocation)}`,
      })),
      albumsRedirect: `/artist/${encodeURI(data.id)}/albums`,
    };

    setArtistView(collection);
  };

  const saveArtist = async (artistDTO) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    var artistFormData = new FormData();
    artistFormData.append("Id", id);
    artistFormData.append("FormFile", artistDTO.file);
    artistFormData.append("Name", artistDTO.name);

    const endPoint = `${apiURL}/artist/update-artist`;
    const response = await fetch(endPoint, {
      method: "POST",
      body: artistFormData,
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      setSuccessMessage("Artist updated successfully!");
      await fetchData();
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.title);
    }
  };

  const deleteArtist = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const endPoint = `${apiURL}/artist/${encodeURIComponent(id)}`;
    const response = await fetch(endPoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (response.ok) {
      setSuccessMessage("Artist removed successfully!");
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.title);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };
    fetchDataAsync();
  }, [id]);

  return (
    <>
      {artistView && (
        <ProfileDetail
          profile={artistView}
          type="Artist"
          isModify={isModify}
          toSave={(artistDTO) => saveArtist(artistDTO)}
          toDelete={deleteArtist}
        />
      )}
    </>
  );
};

export default ViewArtist;
