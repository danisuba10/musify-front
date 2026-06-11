import React, { useEffect, useContext } from "react";
import { useState } from "react";
import HorizontalScrollGrid from "../homepage/HorizontalScrollGrid";
import { apiURL } from "../../assets/Constants";
import { artists } from "../../assets/Constants";
import NoImage from "../../assets/noImage.jpg";
import { AuthContext } from "../auth/AuthProvider";

import "../../styles/homepage/home.css";

const MixedSearchResult = ({ term, clearSearch }) => {
  const [endPoint, setEndPoint] = useState(`${apiURL}/search/mixed`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const { userToken } = useContext(AuthContext);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const url = `${endPoint}?term=${encodeURIComponent(term)}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

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

/**
 * Mirror of MixedSearchResult but fetches from the typo-tolerant search engine.
 * Three parallel per-type calls (10 each) so songs don't crowd out albums/artists.
 * Renders via HorizontalScrollGrid (same layout as MixedSearchResult).
 */
export const TypoMixedSearch = ({ term, clearSearch }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const { userToken } = useContext(AuthContext);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const [songsResp, albumsResp, artistsResp] = await Promise.all([
        fetch(`${apiURL}/search/engine?${new URLSearchParams({ term, entityFilter: "Song",   pageSize: "10" })}`, { headers: { Authorization: `Bearer ${userToken}` } }),
        fetch(`${apiURL}/search/engine?${new URLSearchParams({ term, entityFilter: "Album",  pageSize: "10" })}`, { headers: { Authorization: `Bearer ${userToken}` } }),
        fetch(`${apiURL}/search/engine?${new URLSearchParams({ term, entityFilter: "Artist", pageSize: "10" })}`, { headers: { Authorization: `Bearer ${userToken}` } }),
      ]);

      const songsJson   = await songsResp.json();
      const albumsJson  = await albumsResp.json();
      const artistsJson = await artistsResp.json();

      const songs = (songsJson.hits?.$values || []).map((hit) => ({
        id: hit.parentId ?? hit.id,
        image: hit.imageLocation ? `${apiURL}/image/${encodeURIComponent(hit.imageLocation)}` : NoImage,
        name: hit.name,
        subtitle: "Songs",
        typeCSS: "circle",
      }));

      const albums = (albumsJson.hits?.$values || []).map((hit) => ({
        id: hit.id,
        image: hit.imageLocation ? `${apiURL}/image/${encodeURIComponent(hit.imageLocation)}` : NoImage,
        name: hit.name,
        subtitle: "Albums",
      }));

      const artists = (artistsJson.hits?.$values || []).map((hit) => ({
        id: hit.id,
        image: hit.imageLocation ? `${apiURL}/image/${encodeURIComponent(hit.imageLocation)}` : NoImage,
        name: hit.name,
        subtitle: "Artist",
        typeCSS: "circle",
      }));

      setResults({ artists, albums, songs });
    } catch (err) {
      setError(err.message);
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
              initialElements={results.artists}
              type="circle"
              route="/artist/"
              clearSearch={clearSearch}
            />
            <div className="mt-28"></div>
          </div>
        </>
      )}
    </>
  );
};

export default MixedSearchResult;
