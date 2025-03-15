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
      <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
        Loading..
      </div>
    );
  }

  try {
    const response = await fetch(`${endPoint}?${queryParams}`, {
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
            <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
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
        hasMore={data.searchResults.$values.length === 25}
        onClickRedir={onClickRedir}
      />
    );
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
