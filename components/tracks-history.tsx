"use client";
import { getUserHistoryTracks } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import LikeTrack from "./like-track";
import { EllipsisVerticalIcon } from "lucide-react";

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

  if (!myID) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <span>History</span>

      {historyTracks?.map((track) => {
        if (!track) return null;
        return (
          <div key={track.id} className="flex items-center gap-2  @container">
            <img
              src={track.album.cover_url || ""}
              alt={track.title}
              className="w-12 h-12 rounded"
            />
            <div className="flex-1 flex flex-col">
              <span className="text-lg font-semibold">{track.title}</span>
              {/* {track.artists.map((artist) => (
                <Link href={"/artists/" + artist.id} key={artist.id}>
                  <span className="font-light hover:underline">
                    {artist.name}
                  </span>
                </Link>
              ))} */}
            </div>
            <div className="flex items-center gap-1.5">
              <EllipsisVerticalIcon className="cursor-pointer block @md:hidden" />
              <LikeTrack
                trackID={track.id}
                size={size}
                strokeColor={strokeColor}
                trackAlbumID={track.album.id}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
