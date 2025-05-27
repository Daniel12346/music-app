"use client";
import { useTrackStore } from "@/state/store";
import Link from "next/link";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./audio-player.css";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { addTrackToHistory, getUserHistoryTracks } from "@/lib/database";
import { useEffect } from "react";
import TrackArtists from "./track-artists";
export default function Player() {
  const { currentTrack, playNextTrack, playPrevTrack } = useTrackStore();
  const supabase = createClient();
  const { data: myData } = useSWR("me", async () => {
    const { data } = await supabase.auth.getUser();
    return data;
  });
  const myID = myData?.user?.id;
  const { mutate: mutateHistoryTracks } = useSWR(
    myID ? ["getUserHistoryTracks", myID] : null,
    () => getUserHistoryTracks(supabase, myID)
  );
  useEffect(() => {
    if (currentTrack && myID) {
      //TODO: optimistic update
      addTrackToHistory(
        supabase,
        myID!,
        currentTrack.id,
        currentTrack.albumId
      ).then(() => {
        mutateHistoryTracks();
      });
    }
  }, [currentTrack]);

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
        autoPlayAfterSrcChange
        //TODO: custom icons
        header={
          <div className="flex w-fit gap-2">
            <Link
              href={"/albums/" + currentTrack.albumId}
              className="cursor-pointer"
            >
              <img src={currentTrack.albumCoverUrl} width={50} height={50} />
            </Link>
            <div className="flex flex-col gap-2 justify-center">
              <span>{currentTrack.title}</span>
              <span>
                <TrackArtists artists={currentTrack.artists}></TrackArtists>
              </span>
            </div>
          </div>
        }
        src={currentTrack.url}
        // onPlay={() => console.log(currentTrack)}
      />
    </div>
  );
}
