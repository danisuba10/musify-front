import React, { useState, useEffect, useContext } from "react";
import VerticalScrollGrid from "./VerticalScrollGrid";
import { apiURL } from "../../assets/Constants";
import NoImage from "../../assets/noImage.jpg";
import "../../styles/library/library.css";
import Cookies from "js-cookie";
import { AuthContext } from "../auth/AuthProvider";
import { fetchLibraryPage } from "../Service/LibraryService";

export default function UserLibrary() {
  const { isAuthenticated, userToken } = useContext(AuthContext);
  const [compact, setCompact] = useState(true);
  const [cards, setCards] = useState([]);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [lastItemId, setLastItemId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const handleCookieChange = () => {
      if (window.innerHeight > window.innerWidth) {
        if (Cookies.get("compact") === "false") {
          setCompact(true);
        }
        return;
      }
      setCompact(Cookies.get("compact") !== "false");
    };

    const cookieChangeListener = setInterval(handleCookieChange, 1000);

    return () => clearInterval(cookieChangeListener);
  }, []);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch library data and reset state
  const refreshLibrary = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetchLibraryPage({ userToken, pageSize: 25 });
      const mappedCards = response.items.map((item) => ({
        id: item.id,
        itemId: item.itemId,
        itemType: item.itemType,
        name: item.name,
        subtitle: item.subtitle,
        image: item.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(item.imageLocation)}`
          : NoImage,
        savedAt: item.savedAt,
      }));
      setCards(mappedCards);
      setLastSavedAt(response.lastSavedAt);
      setLastItemId(response.lastItemId);
      setHasMore(response.items.length === 25);
    } catch (err) {
      console.error("Failed to load library", err);
    } finally {
      setInitialLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    refreshLibrary();
  }, [isAuthenticated, userToken]);

  // Listen for library-changed events (triggered after toggle)
  useEffect(() => {
    const handleLibraryChanged = () => {
      setInitialLoading(true);
      refreshLibrary();
    };
    window.addEventListener("library-changed", handleLibraryChanged);
    return () => window.removeEventListener("library-changed", handleLibraryChanged);
  }, [isAuthenticated, userToken]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await fetchLibraryPage({ userToken, pageSize: 25, lastSavedAt, lastItemId });
      const mappedCards = response.items.map((item) => ({
        id: item.id,
        itemId: item.itemId,
        itemType: item.itemType,
        name: item.name,
        subtitle: item.subtitle,
        image: item.imageLocation
          ? `${apiURL}/image/${encodeURIComponent(item.imageLocation)}`
          : NoImage,
        savedAt: item.savedAt,
      }));
      setCards((prev) => [...prev, ...mappedCards]);
      setLastSavedAt(response.lastSavedAt);
      setLastItemId(response.lastItemId);
      setHasMore(response.items.length === 25);
    } catch (err) {
      console.error("Failed to load more library items", err);
    } finally {
      setLoading(false);
    }
  };

  // Not authenticated — hide entirely
  if (!isAuthenticated) return null;

  return windowWidth < 600 ? null : (
    <div
      className={`library-container ${
        compact
          ? `md:min-w-fit w-[5vw] max-w-[5vw]`
          : " md:min-w-[220px] w-[15vw] max-w-[15vw]"
      }`}
    >
      {initialLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent" />
        </div>
      ) : cards.length === 0 ? (
        compact ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"/>
            </svg>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-2">
            <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z"/>
            </svg>
            <p className="text-xs text-center">Your library is empty</p>
            <p className="text-xs text-center text-gray-500 mt-1">Save albums, artists, or playlists</p>
          </div>
        )
      ) : (
        <VerticalScrollGrid
          title="Library"
          cards={cards}
          compact={compact}
          hasMore={hasMore}
          onLoadMore={loadMore}
          loading={loading}
        />
      )}
    </div>
  );
}
