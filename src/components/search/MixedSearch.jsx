import React, { useEffect } from "react";
import { useState } from "react";
import HorizontalScrollGrid from "../homepage/HorizontalScrollGrid";
import { apiURL } from "../../assets/Constants";
import { artists } from "../../assets/Constants";
import NoImage from "../../assets/noImage.jpg";

import "../../styles/homepage/home.css";

const MixedSearchResult = ({ term, clearSearch }) => {
  const [endPoint, setEndPoint] = useState(`${apiURL}/search/mixed`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const url = `${endPoint}?term=${encodeURIComponent(term)}`;
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data fetched: ", data);

      const artists = data.artists.$values.map((artist) => ({
        id: artist.id,
        image: artist.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(artist.imageLocation)}`
          : NoImage,
        name: artist.name,
        subtitle: "Artist",
        typeCSS: "circle",
      }));

      const albums = data.albums.$values.map((album) => ({
        id: album.id,
        image: album.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(album.imageLocation)}`
          : NoImage,
        name: album.name,
        subtitle: "Albums",
      }));

      const songs = data.songs.$values.map((song) => ({
        id: song.parentId,
        image: song.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(song.imageLocation)}`
          : NoImage,
        name: song.name,
        subtitle: "Songs",
        typeCSS: "circle",
      }));

      const playlists = data.playlists.$values.map((playlist) => ({
        id: playlist.id,
        image: playlist.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(playlist.imageLocation)}`
          : NoImage,
        name: playlist.name,
        subtitle: "Playlists",
      }));

      setResults({ artists, albums, songs, playlists });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {results && (
        <>
          <div className="overflow-y-scroll h-full">
            <HorizontalScrollGrid
              title="Songs"
              initialElements={results.songs}
              type="circle"
              route="/album/"
              clearSearch={clearSearch}
            />
            <HorizontalScrollGrid
              title="Albums"
              initialElements={results.albums}
              route="/album/"
              clearSearch={clearSearch}
            />
            <HorizontalScrollGrid
              title="Artists"
              artists={artists}
              initialElements={results.artists}
              type="circle"
              route="/artist/"
              clearSearch={clearSearch}
            />
            <HorizontalScrollGrid
              title="Playlists"
              initialElements={results.playlists}
              type="circle"
              route="/playlist/"
              clearSearch={clearSearch}
            />
            <div className="mt-28"></div>
          </div>
        </>
      )}
      {/* <HorizontalScrollGrid title="Playlists" artists={artists} type="circle" />
      <HorizontalScrollGrid title="Users" artists={artists} />
      <div className="mt-10"></div> */}
    </>
  );
};

export default MixedSearchResult;
