import React, { useRef, useState, useEffect } from "react";
import { apiURL } from "../../assets/Constants";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

const MusicPlayer = ({ songId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [songInfo, setSongInfo] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!songInfo) return;
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Playback failed:", e));
    }
  }, [songInfo]);

  useEffect(() => {
    if (!songId) return;
    const fetchSongFile = async () => {
      try {
        const response = await fetch(
          `${apiURL}/song/${encodeURIComponent(songId)}/play`
        );

        if (response.ok) {
          const data = await response.json();
          setSongInfo({
            streamUrl: `${apiURL}/sound/${encodeURIComponent(
              data.songFileUrl
            )}?format=opus&bitrate=128`,
            songTitle: data.song.title,
            artists: data.song.artists.$values.map((artist) => artist.name),
            image: `${apiURL}/image/${encodeURIComponent(data.songImage)}`,
          });
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        console.error("Error fetching!: ", error);
      }
    };
    fetchSongFile();
  }, [songId]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time) => {
    if (!currentTime) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds}`
      : `${minutes}:${seconds}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;

    const seekTime = parseFloat(e.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-4 py-2 flex items-center z-50">
      <audio
        ref={audioRef}
        src={songInfo?.streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex w-full justify-between">
        <div className="flex relative items-center h-full w-1/4">
          {songInfo?.image && (
            <img
              src={songInfo.image}
              alt="Album cover"
              className="h-12 w-12 object-cover mr-3"
            />
          )}
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium truncate">
              {songInfo?.songTitle || "No track selected"}
            </span>
            <span className="text-gray-400 text-xs truncate">
              {songInfo?.artists?.join(", ") || ""}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center mb-2 w-full">
            {/* Playback controls */}
            <div className="flex items-center justify-center space-x-4">
              <button className="text-gray-400 hover:text-white focus:outline-none">
                <SkipBack size={20} />
              </button>
              <button
                className="text-white p-1 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button className="text-gray-400 hover:text-white focus:outline-none">
                <SkipForward size={20} />
              </button>
            </div>
            {/* Volume control */}
          </div>

          {/* Progress bar row */}
          <div className="flex items-center justify-center space-x-3 w-full">
            <span className="text-xs text-gray-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex w-[40%] h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500"
            />
            <span className="text-xs text-gray-400 w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        <div className="flex items-center w-1/4 justify-end">
          <button
            className="text-gray-400 hover:text-white focus:outline-none mr-2"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
