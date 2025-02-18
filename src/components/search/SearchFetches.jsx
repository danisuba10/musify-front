import { React } from "react";
import TableSearch from "./TableSearch";
import { apiURL } from "../../assets/Constants";

export const search = async (
  setSearchDisplay,
  term,
  endPoint,
  rounded = false,
  title
) => {
  const formData = new FormData();
  formData.append("SearchTerm", term);
  formData.append("LastName", "");
  formData.append("LastCreatedAt", "");
  formData.append("PageSize", 50);

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
      if (setSearchDisplay) {
        setSearchDisplay(
          <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
            No {title.toLowerCase()} found for "{term}".
          </div>
        );
        return [];
      }
      return [];
    }

    const albums = data.searchResults.$values.map((album) => ({
      id: album.id,
      name: album.name,
      image: `${apiURL}/image/${encodeURIComponent(album.imageLocation)}`,
    }));

    console.log("Results before returning:", albums);

    if (setSearchDisplay) {
      setSearchDisplay(
        <TableSearch
          title={title}
          elements={albums}
          type={rounded ? "circle" : ""}
        />
      );
    }
    return albums;
  } catch (error) {
    console.error("Error fetching:", error);
    if (error.message === "Not Found") {
      if (setSearchDisplay) {
        setSearchDisplay(
          <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
            No {title.toLowerCase()} found for "{term}".
          </div>
        );
      }
      return [];
    }

    if (setSearchDisplay) {
      setSearchDisplay(
        <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
          An error occurred while fetching {title.toLowerCase()}. Error:{" "}
          {error.message}
        </div>
      );
    }
    throw error;
  }
};
