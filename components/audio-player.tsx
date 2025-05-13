"use client";
import { useStore } from "@/state/store";
import { StopCircleIcon } from "lucide-react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

export default function Player() {
  const { trackUrl, setTrackUrl } = useStore();
  if (!trackUrl) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <StopCircleIcon onClick={() => setTrackUrl("")}></StopCircleIcon>
      <AudioPlayer
        showSkipControls
        //TODO: track title, artist, album, cover art
        //TODO: custom icons
        header={<h1 className="text-red bg-red-500 absolute">Audio Player</h1>}
        src={trackUrl}
        onPlay={(e) => console.log("onPlay")}
      />
    </div>
  );
}
