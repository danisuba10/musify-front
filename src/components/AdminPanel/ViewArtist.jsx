import { React, useEffect, useState } from "react";
import { apiURL } from "../../assets/Constants";

import ProfileDetail from "../details/ProfileDetail/ProfileDetail";

const ViewArtist = ({ id, isModify = false }) => {
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
    console.log(response);
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
    };

    console.log(collection);
    setArtistView(collection);
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      await fetchData();
    };
    fetchDataAsync();
  }, [id]);

  return (
    <>{artistView && <ProfileDetail profile={artistView} type="Artist" />}</>
  );
};

export default ViewArtist;
