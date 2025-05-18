"use client";
import { useStore } from "@/state/store";
import { StopCircleIcon } from "lucide-react";
import Link from "next/link";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
// import 'react-h5-audio-player/lib/styles.less' Use LESS
// import 'react-h5-audio-player/src/styles.scss' Use SASS

export default function Player() {
  const { currentTrack, playNextTrack, playPrevTrack } = useStore();
  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <AudioPlayer
        style={{ background: "black", opacity: "70%" }}
        showSkipControls
        showJumpControls={false}
        onClickNext={() => playNextTrack()}
        onEnded={() => playNextTrack()}
        onClickPrevious={() => playPrevTrack()}
        //TODO: track title, artist, album, cover art
        //TODO: custom icons
        header={
          <div className="flex bg-black w-fit">
            <img src={currentTrack.albumCoverUrl} width={50} height={50} />
            <div className="flex flex-col">
              <span>{currentTrack.title}</span>
              <span>
                {currentTrack.artists.map((artist) => (
                  <Link href={"/artists" + artist.id} key={artist.id}>
                    <span>{artist.name}</span>
                  </Link>
                ))}
              </span>
            </div>
          </div>
        }
        src={currentTrack.url}
        onPlay={() => console.log("onPlay")}
      />
    </div>
  );
}
