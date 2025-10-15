"use client";
import { getTracksLikedByUser } from "@/lib/database";
import { addNewQueueIdToTrack } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { XIcon } from "lucide-react";
import useSWR from "swr";
import LikeTrack from "./like-track";
import TrackArtists from "./track-artists";
import TrackOptionsButton from "./track-options";
import { useTrackStore } from "@/state/store";

export default function TracksLiked({
  size = 16,
  strokeColor,
}: {
  size?: number;
  strokeColor?: string;
}) {
  const supabase = createClient();
  const { data } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;

  const {
    data: myLikedTracks,
    error,
    isLoading,
  } = useSWR(myID ? ["getTracksLikedByUser", myID] : null, () =>
    getTracksLikedByUser(supabase, myID)
  );
  const { setCurrentTrack } = useTrackStore();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-semibold text-muted-foreground">
        Liked tracks
      </span>

      {myLikedTracks?.map(({ track, track_album }) => {
        if (!track) return null;
        const TrackWithExtra = {
          ...track,
          albumCoverUrl: track_album.cover_url || "",
          albumId: track_album.id, // Assuming albumId is the same as album ID
          artists: track.artists || [],
          albumName: track_album.title || "",
        };

        return (
          <div
            key={track.id}
            className="flex cursor-pointer items-center gap-2  @container"
            onClick={
              () => setCurrentTrack(addNewQueueIdToTrack(TrackWithExtra)) // Add queueId to track
              //TODO: set queue to something (history tracks?)
            }
          >
            <img
              src={track_album.cover_url || ""}
              alt={track.title}
              className="w-10 h-10 rounded"
            />
            <div className="flex-1 flex flex-col">
              <span className="text-lg ">{track.title}</span>

              <TrackArtists artists={track.artists} />
            </div>

            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <TrackOptionsButton track={TrackWithExtra} />
              <LikeTrack
                trackID={track.id}
                size={size}
                strokeColor={strokeColor}
                trackAlbumID={track_album.id}
              />
              <XIcon />
            </div>
          </div>
        );
      })}
    </div>
  );
}
