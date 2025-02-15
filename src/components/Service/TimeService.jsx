import React from "react";

export function object_to_seconds(durationObj) {
  return (
    durationObj.hours * 3600 + durationObj.minutes * 60 + durationObj.seconds
  );
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
  }${seconds}s`;
}
