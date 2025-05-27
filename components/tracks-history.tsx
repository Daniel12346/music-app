"use client";
import { getUserHistoryTracks } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import LikeTrack from "./like-track";
import { EllipsisVerticalIcon, XIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import TrackArtists from "./track-artists";
import { useTrackStore } from "@/state/store";
import { generateId } from "@/lib/utils";

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
        History
      </span>

      {historyTracks
        ?.toSorted(
          (a, b) =>
            new Date(b.last_played_at).getTime() -
            new Date(a.last_played_at).getTime()
        )
        .map((track) => {
          if (!track) return null;
          return (
            <div
              key={track.id}
              className="flex cursor-pointer items-center gap-2  @container"
              onClick={
                () =>
                  setCurrentTrack({
                    ...track,
                    queueId: generateId(),
                    albumCoverUrl: track.album.cover_url || "",
                    albumId: track.album.id, // Assuming albumId is the same as album ID
                    artists: track.artists || [],
                    albumName: track.album.title || "",
                  })
                //TODO: set queue to something (history tracks?)
              }
            >
              <img
                src={track.album.cover_url || ""}
                alt={track.title}
                className="w-10 h-10 rounded"
              />
              <div className="flex-1 flex flex-col">
                <span className="text-lg ">{track.title}</span>

                <TrackArtists artists={track.artists} />
              </div>
              <span className="hidden @sm:block text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(track.last_played_at), {
                  addSuffix: true,
                })}
              </span>
              <div className="flex items-center gap-1.5">
                <EllipsisVerticalIcon className="cursor-pointer block @md:hidden" />
                <LikeTrack
                  trackID={track.id}
                  size={size}
                  strokeColor={strokeColor}
                  trackAlbumID={track.album.id}
                />
                <XIcon />
              </div>
            </div>
          );
        })}
    </div>
  );
}
