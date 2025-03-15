import React from "react";

export function object_to_seconds(durationObj) {
  const hours = parseInt(durationObj.hours, 10);
  const minutes = parseInt(durationObj.minutes, 10);
  const seconds = parseInt(durationObj.seconds, 10);

  return hours * 3600 + minutes * 60 + seconds;
}

export function duration_to_object(duration) {
  return {
    hours: Math.floor(duration / 3600),
    minutes: Math.floor((duration % 3600) / 60),
    seconds: duration % 60,
  };
}

export function duration_to_str(duration) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return `${hours > 0 ? `${hours}h : ` : ""}${
    minutes > 0 ? `${minutes}m : ` : ""
  }${seconds > 0 && seconds < 10 ? `0${seconds}` : `${seconds}`}s`;
}
