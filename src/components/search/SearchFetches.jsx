import { React } from "react";
import TableSearch from "./TableSearch";
import { apiURL } from "../../assets/Constants";

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
}) => {
  const formData = new FormData();
  formData.append("SearchTerm", term);
  formData.append("LastName", lastName);
  formData.append("LastCreatedAt", lastCreatedAt);
  formData.append("PageSize", 25);
  console.log("Last data: ", lastName, lastCreatedAt);

  if (setSearchDisplay) {
    setSearchDisplay(
      <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
        Loading..
      </div>
    );
  }

  try {
    const response = await fetch(endPoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Not Found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data fetched: ", data);

    if (
      !data.searchResults?.$values ||
      data.searchResults.$values.length === 0
    ) {
      setHasMore(false);
      if (existingResults.length === 0) {
        if (setSearchDisplay) {
          setSearchDisplay(
            <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
              No {title.toLowerCase()} found for "{term}".
            </div>
          );
        }
        return [];
      }
      return existingResults;
    }

    const newResults = data.searchResults.$values.map((album) => ({
      id: album.id,
      name: album.name,
      image: `${apiURL}/image/${encodeURIComponent(album.imageLocation)}`,
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
    if (error.message === "Not Found" && existingResults.length === 0) {
      if (setSearchDisplay) {
        setSearchDisplay(
          <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
            No {title.toLowerCase()} found for "{term}".
          </div>
        );
      }
      return [];
    }

    if (setSearchDisplay && existingResults.length === 0) {
      setSearchDisplay(
        <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
          An error occurred while fetching {title.toLowerCase()}. Error:{" "}
          {error.message}
        </div>
      );
      return [];
    }

    return existingResults;
  }
};
