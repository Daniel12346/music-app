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
import { ListIcon, Repeat1Icon, ShuffleIcon } from "lucide-react";
import LikeTrack from "./like-track";
export default function Player() {
  const {
    currentTrack,
    playNextTrack,
    playPrevTrack,
    toggleShuffle,
    isShuffleActive,
  } = useTrackStore();
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
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full">
      <AudioPlayer
        showSkipControls
        showJumpControls={false}
        onClickNext={() => playNextTrack()}
        onEnded={() => playNextTrack()}
        onClickPrevious={() => playPrevTrack()}
        autoPlayAfterSrcChange
        //TODO: custom icons
        header={
          <div className="w-full flex items-center justify-between">
            <div className="flex w-fit gap-2 ">
              <Link
                href={"/albums/" + currentTrack.albumId}
                className="cursor-pointer"
              >
                <img src={currentTrack.albumCoverUrl} width={50} height={50} />
              </Link>
              <div className="flex flex-col gap-2 max-w-30 md:max-w-60 justify-center">
                <span className="truncate">{currentTrack.title}</span>
                <span className="truncate">
                  <TrackArtists artists={currentTrack.artists}></TrackArtists>
                </span>
              </div>
              <div className="flex items-center">
                <LikeTrack
                  size={20}
                  trackID={currentTrack.id}
                  trackAlbumID={currentTrack.albumId}
                />
              </div>
            </div>

            <div className="flex  gap-3 md:gap-4">
              <Repeat1Icon />
              <ShuffleIcon
                onClick={() => {
                  toggleShuffle();
                }}
                className={
                  isShuffleActive ? "text-green-600" : "text-muted-foreground"
                }
              />
              <Link href={`/queue`}>
                <ListIcon />
              </Link>
            </div>
          </div>
        }
        src={currentTrack.url}
        // onPlay={() => console.log(currentTrack)}
        customAdditionalControls={[]}
      />
    </div>
  );
}
