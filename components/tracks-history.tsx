"use client";
import { getUserHistoryTracks } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import LikeTrack from "./like-track";
import { XIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import TrackArtists from "./track-artists";
import { useTrackStore } from "@/state/store";
import { addNewQueueIdToTrack } from "@/lib/utils";
import TrackOptionsButton from "./track-options";
import Image from "next/image";

export default function TracksHistory({
  size = 16,
  strokeColor,
}: {
  size?: number;
  strokeColor?: string;
}) {
  const supabase = createClient();
  const { data: myData } = useSWR("me", async () => {
    const { data } = await supabase.auth.getUser();
    return data;
  });
  const myID = myData?.user?.id;
  const { data: historyTracks } = useSWR(
    myID ? ["getUserHistoryTracks", myID] : null,
    () => getUserHistoryTracks(supabase, myID)
  );
  const { setCurrentTrack } = useTrackStore();

  if (!myID) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg font-semibold text-muted-foreground">
        Recent tracks
      </span>

      {historyTracks
        ?.toSorted(
          (a, b) =>
            new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
        )
        .map((record) => {
          if (!record) return null;
          const { track, track_album } = record;
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
                () =>
                  setCurrentTrack(addNewQueueIdToTrack(TrackWithExtra), {
                    sourceId: null,
                    sourceType: "HISTORY",
                    sourceName: "Recent tracks",
                  })
                //TODO: set queue to history tracks
              }
            >
              <Image
                src={track_album.cover_url || ""}
                alt={track.title}
                width={120}
                height={120}
                className="w-10 h-10 rounded"
              />
              <div className="flex-1 flex flex-col">
                <span className="text-lg ">{track.title}</span>

                <TrackArtists artists={track.artists} />
              </div>
              <span className="hidden @sm:block text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(record.played_at), {
                  addSuffix: true,
                })}
              </span>
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
