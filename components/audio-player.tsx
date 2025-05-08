"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

export default function Player({ src }: { src: string }) {
  if (!src) {
    return null;
  }
  return (
    <AudioPlayer
      showSkipControls
      //TODO: track title, artist, album, cover art
      //TODO: custom icons
      header={<h1 className="text-red bg-red-500">Audio Player</h1>}
      src={src}
      onPlay={(e) => console.log("onPlay")}
    />
  );
}
