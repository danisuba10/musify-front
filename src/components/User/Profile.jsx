import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";
import { apiURL } from "../../assets/Constants";
import ProfileDetail from "../details/ProfileDetail/ProfileDetail";
import NoImage from "../../assets/noImage.jpg";

const Profile = ({ id, isModify, setIsModify }) => {
  const { isAdmin, userToken, getUserId } = useContext(AuthContext);

  const [profileView, setProfileView] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [gridDatas, setGridDatas] = useState({ playlists: [] });

  const switchModify = () => {
    setIsModify(!isModify);
    setSuccessMessage(null);
    setSuccessMessage(null);
  };

  const fetchProfile = async () => {
    setErrorMessage(null);
    if (!id) {
      const emptyCollection = {
        type: "Profile",
        id: null,
        name: "",
        image: "",
        details: {
          public_playlist_cnt: 0,
          followers: 0,
          following: 0,
        },
        colors: {
          low: "#A192B4",
          middle: "#685E74",
          top: "#4B4454",
        },
      };
      setProfileView(emptyCollection);
      return;
    }

    try {
      const response = await fetch(
        `${apiURL}/user/${encodeURIComponent(id)}/profile`
      );

      if (response.ok) {
        const data = await response.json();
        const collection = {
          type: "Profile",
          id: data.id,
          name: data.name,
          image: data.image.imageLocation
            ? `${apiURL}/image/${encodeURIComponent(data.image.imageLocation)}`
            : NoImage,
          details: {
            public_playlist_cnt: data.publicPlaylistCount,
            followers: 0,
            following: 0,
          },
          colors: {
            low:
              data.image.lowColor && data.image.lowColor !== ""
                ? data.image.lowColor
                : "#A192B4",
            middle:
              data.image.middleColor && data.image.middleColor !== ""
                ? data.image.middleColor
                : "#685E74",
            top:
              data.image.highColor && data.image.highColor !== ""
                ? data.image.highColor
                : "#4B4454",
          },
        };
        setProfileView(collection);
      } else if (response.status === 404) {
        return;
      } else {
        setErrorMessage(await response.text());
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(
        `${apiURL}/user/${encodeURIComponent(id)}/profile/playlists`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const topPlaylists = data.$values.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          image: playlist.imageLocation
            ? `${apiURL}/image/${encodeURIComponent(playlist.imageLocation)}`
            : NoImage,
          typeCSS: "square",
          subtitle: "Playlist",
        }));
        setGridDatas((prevData) => ({ ...prevData, playlists: topPlaylists }));
      } else if (response.status === 404) {
        return;
      } else {
        setErrorMessage(await response.text());
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const fetchData = async () => {
    await fetchProfile();
    await fetchPlaylists();
  };

  const saveProfile = async (profileDTO) => {
    setSuccessMessage(null);
    setSuccessMessage(null);
    try {
      var formData = new FormData();
      formData.append("DisplayName", profileDTO.name);
      formData.append("File", profileDTO.file);
      const response = await fetch(`${apiURL}/user/profile/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });
      if (response.ok) {
        setSuccessMessage("Profile successfully updated!");
        fetchProfile();
      } else {
        const errorData = await response.text();
        setErrorMessage(errorData);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, getUserId()]);

  return (
    <div
      className="flex flex-col gap-1 w-full overflow-hidden"
      style={{ backgroundImage: "linear-gradient(to right, #191910, #191912)" }}
    >
      {isModify && successMessage && (
        <div className="w-full flex flex-wrap items-center justify-center">
          <div className="font-bold text-white mt-2 mb-2 p-2 border-2 border-green-400 rounded-lg w-[50%] flex items-center justify-center">
            {successMessage}
          </div>
        </div>
      )}
      {isModify && errorMessage && (
        <div className="w-full flex flex-wrap items-center justify-center">
          <div className=" mt-2 mb-2 p-2 border-2 border-orange-500 rounded-lg w-[50] flex items-center justify-center">
            <span className="font-bold text-white text-center">
              Profile update error: {errorMessage}
            </span>
            .
          </div>
        </div>
      )}
      {profileView && (
        <ProfileDetail
          profile={profileView}
          type="Profile"
          isModify={isModify}
          setIsModify={setIsModify}
          switchModify={switchModify}
          horizontalScrollGridDatas={[
            {
              title: "Top playlists",
              subitle: "Playlist",
              type: "square",
              elements: gridDatas.playlists,
              route: "/playlist/",
            },
          ]}
          toSave={(profileDTO) => saveProfile(profileDTO)}
        />
      )}
    </div>
  );
};

export default Profile;
