import { React } from "react";
import TableSearch from "./TableSearch";
import { apiURL } from "../../assets/Constants";

export const search = (
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

  setSearchDisplay(
    <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
      Loading..
    </div>
  );

  fetch(endPoint, {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Not Found");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched: ", data);
      if (
        !data.searchResults ||
        !data.searchResults.$values ||
        data.searchResults.$values.length === 0
      ) {
        setSearchDisplay(
          <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
            No {title.toLowerCase()} found for "{term}".
          </div>
        );
      } else {
        const albums = data.searchResults.$values.map((album) => ({
          id: album.id,
          name: album.name,
          image: `${apiURL}/image/${encodeURIComponent(album.imageLocation)}`,
        }));
        setSearchDisplay(
          <TableSearch
            title={title}
            elements={albums}
            type={rounded ? "circle" : ""}
          />
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching albums:", error);
      if (error.message === "Not Found") {
        setSearchDisplay(
          <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
            No {title.toLowerCase()} found for "{term}".
          </div>
        );
      } else {
        setSearchDisplay(
          <div className="text-white text-3xl font-bold ml-10 w-full h-auto">
            An error occurred while fetching {title.toLowerCase()}. Error:{" "}
            {error.message}
          </div>
        );
      }
    });
};

export const searchArtists = () => {
  const formData = new FormData();
  formData.append("SearchTerm", term);
  formData.append("LastName", "");
  formData.append("LastCreatedAt", "");
  formData.append("PageSize", 50);
};
