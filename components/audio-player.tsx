"use client";
import { useTrackStore } from "@/state/store";
import Link from "next/link";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./audio-player.css";
export default function Player() {
  const { currentTrack, playNextTrack, playPrevTrack } = useTrackStore();
  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <AudioPlayer
        showSkipControls
        showJumpControls={false}
        onClickNext={() => playNextTrack()}
        onEnded={() => playNextTrack()}
        onClickPrevious={() => playPrevTrack()}
        //TODO: custom icons
        header={
          <div className="flex w-fit gap-2">
            <Link
              href={"/albums/" + currentTrack.albumId}
              className="cursor-pointer"
            >
              <img src={currentTrack.albumCoverUrl} width={50} height={50} />
            </Link>
            <div className="flex flex-col gap-2">
              <span>{currentTrack.title}</span>
              <span>
                {currentTrack.artists.map((artist) => (
                  <Link href={"/artists/" + artist.id} key={artist.id}>
                    <span className="font-light opacity-85 hover:underline">
                      {artist.name}
                    </span>
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
