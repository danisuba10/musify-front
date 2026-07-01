import { React, useContext } from "react";
import TableSearch from "./TableSearch";
import { apiURL } from "../../assets/Constants";
import NoImage from "../../assets/noImage.jpg";

export const search = async ({
  setSearchDisplay,
  term,
  endPoint,
  rounded = false,
  title,
  setLastFoundName,
  setLastFoundCreatedAt,
  lastName,
  lastCreatedAt,
  existingResults = [],
  setHasMore = () => {},
  onLoadMore = () => {},
  selectionFunc,
  onClickRedir,
  userToken,
}) => {
  const queryParams = new URLSearchParams({
    SearchTerm: term,
    LastName: lastName,
    LastCreatedAt: lastCreatedAt,
    PageSize: 25,
  }).toString();

  if (setSearchDisplay) {
    setSearchDisplay(
      <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-auto overflow-hidden break-words">
        Loading..
      </div>
    );
  }

  try {
    const separator = endPoint.includes('?') ? '&' : '?';
    const response = await fetch(`${endPoint}${separator}${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Not Found");
      }
      return await response.text().then((errorMessage) => {
        throw new Error(errorMessage);
      });
    }

    const data = await response.json();

    if (
      !data.searchResults?.$values ||
      data.searchResults.$values.length === 0
    ) {
      setHasMore(false);
      if (existingResults.length === 0) {
        if (setSearchDisplay) {
          setSearchDisplay(
            <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-auto overflow-hidden break-words">
              No {title.toLowerCase()} found for "{term}".
            </div>
          );
        }
        return [];
      }
      return existingResults;
    }

    const newResults = data.searchResults.$values.map((elem) => ({
      id: elem.parentId ?? elem.id,
      name: elem.name,
      image: elem.imageLocation
        ? `${apiURL}/image/${encodeURIComponent(elem.imageLocation)}`
        : NoImage,
    }));

    const allResults = [...existingResults, ...newResults];

    if (setLastFoundName) {
      setLastFoundName(data.lastName);
    }
    if (setLastFoundCreatedAt) {
      setLastFoundCreatedAt(data.lastCreatedAt);
    }

    if (setSearchDisplay) {
      setSearchDisplay(
        <TableSearch
          title={title}
          elements={allResults}
          type={rounded ? "circle" : ""}
          selectionFunc={selectionFunc}
          onLoadMore={onLoadMore}
          hasMore={data.searchResults.$values.length === 25}
          onClickRedir={onClickRedir}
        />
      );
    }
    setHasMore(data.searchResults.$values.length === 25);
    return newResults;
  } catch (error) {
    console.error("Error fetching:", error);
    setHasMore(false);
    setSearchDisplay(
      <TableSearch
        title={title}
        elements={existingResults}
        type={rounded ? "circle" : ""}
        selectionFunc={selectionFunc}
        onLoadMore={onLoadMore}
        hasMore={false}
        onClickRedir={onClickRedir}
      />
    );
    if (error.message === "Not Found" && existingResults.length === 0) {
      if (setSearchDisplay) {
        setSearchDisplay(
          <div className="flex flex-col overflow-y-auto overflow-x-hidden w-full h-full">
            <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-full overflow-hidden break-words">
              No {title.toLowerCase()} found for "{term}".
            </div>
          </div>
        );
      }
      return [];
    }

    if (setSearchDisplay && existingResults.length === 0) {
      setSearchDisplay(
        <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-auto overflow-hidden break-words">
          An error occurred while fetching {title.toLowerCase()}. Error:{" "}
          {error.message}
        </div>
      );
      return [];
    }

    return existingResults;
  }
};

/**
 * Search using the typo-tolerant search engine API (/search/engine).
 * Response shape differs from the standard search endpoints:
 *   - hits.$values[]  (instead of searchResults.$values[])
 *   - hasMore         (boolean, instead of inferring from page size)
 *   - nextLastName / nextLastCreatedAt (cursor keys)
 * Each hit has entityType, which we surface as the card subtitle.
 */
export const searchEngine = async ({
  setSearchDisplay,
  term,
  entityFilter,
  rounded = false,
  title,
  setLastFoundName,
  setLastFoundCreatedAt,
  lastName,
  lastCreatedAt,
  existingResults = [],
  setHasMore = () => {},
  onLoadMore = () => {},
  selectionFunc,
  onClickRedir,
  userToken,
}) => {
  // Normalize plural UI filter names → singular SearchEntityType enum values
  const entityFilterMap = {
    Songs: "Song",
    Artists: "Artist",
    Albums: "Album",
    Playlists: "Playlist",
    Users: "User",
    All: "All",
  };
  const normalizedFilter = entityFilterMap[entityFilter] ?? entityFilter;

  const params = new URLSearchParams({
    term: term,
    entityFilter: normalizedFilter,
    pageSize: "25",
  });
  if (lastName) params.set("lastName", lastName);
  if (lastCreatedAt) params.set("lastCreatedAt", lastCreatedAt);

  if (setSearchDisplay) {
    setSearchDisplay(
      <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-auto overflow-hidden break-words">
        Loading..
      </div>
    );
  }

  try {
    const response = await fetch(
      `${apiURL}/search/engine?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Not Found");
      }
      return await response.text().then((errorMessage) => {
        throw new Error(errorMessage);
      });
    }

    const data = await response.json();

    if (!data.hits?.$values || data.hits.$values.length === 0) {
      setHasMore(false);
      if (existingResults.length === 0) {
        if (setSearchDisplay) {
          setSearchDisplay(
            <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-auto overflow-hidden break-words">
              No {title.toLowerCase()} found for "{term}".
            </div>
          );
        }
        return [];
      }
      return existingResults;
    }

    const newResults = data.hits.$values.map((hit) => ({
      id: hit.parentId ?? hit.id,
      name: hit.name,
      subtitle: hit.entityType,
      image: hit.imageLocation
        ? `${apiURL}/image/${encodeURIComponent(hit.imageLocation)}`
        : NoImage,
    }));

    const allResults = [...existingResults, ...newResults];

    // Search engine uses nextLastName / nextLastCreatedAt for cursor pagination
    if (setLastFoundName) {
      setLastFoundName(data.nextLastName ?? "");
    }
    if (setLastFoundCreatedAt) {
      setLastFoundCreatedAt(data.nextLastCreatedAt ?? "");
    }

    const pageHasMore = data.hasMore === true;

    if (setSearchDisplay) {
      setSearchDisplay(
        <TableSearch
          title={title}
          elements={allResults}
          type={rounded ? "circle" : ""}
          selectionFunc={selectionFunc}
          onLoadMore={onLoadMore}
          hasMore={pageHasMore}
          onClickRedir={onClickRedir}
        />
      );
    }
    setHasMore(pageHasMore);
    return newResults;
  } catch (error) {
    console.error("Error fetching (search engine):", error);
    setHasMore(false);
    setSearchDisplay(
      <TableSearch
        title={title}
        elements={existingResults}
        type={rounded ? "circle" : ""}
        selectionFunc={selectionFunc}
        onLoadMore={onLoadMore}
        hasMore={false}
        onClickRedir={onClickRedir}
      />
    );
    if (error.message === "Not Found" && existingResults.length === 0) {
      if (setSearchDisplay) {
        setSearchDisplay(
          <div className="flex flex-col overflow-y-auto overflow-x-hidden w-full h-full">
            <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-full overflow-hidden break-words">
              No {title.toLowerCase()} found for "{term}".
            </div>
          </div>
        );
      }
      return [];
    }

    if (setSearchDisplay && existingResults.length === 0) {
      setSearchDisplay(
        <div className="text-white text-3xl font-bold ml-10 mr-10 w-auto h-auto overflow-hidden break-words">
          An error occurred while fetching {title.toLowerCase()}. Error:{" "}
          {error.message}
        </div>
      );
      return [];
    }

    return existingResults;
  }
};
