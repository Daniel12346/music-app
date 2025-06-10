"use client";
import {
  likePlaylist,
  unlikePlaylist,
  getPlaylistsLikedByUser,
} from "@/lib/database";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { HeartIcon } from "lucide-react";
import useSWR from "swr";

export default function LikePlaylist({
  playlistID,
  size = 16,
  strokeColor,
}: {
  playlistID: string;
  size?: number;
  strokeColor?: string;
}) {
  const supabase = createClient();
  const { data: myData } = useSWR("me", async () => {
    const { data } = await supabase.auth.getUser();
    return data;
  });
  const myID = myData?.user?.id;
  const { data: liked, mutate: mutateLiked } = useSWR(
    myID ? ["getPlaylistsLikedByUser", myID] : null,
    () => getPlaylistsLikedByUser(supabase, myID!)
  );
  const isPlaylistLiked =
    liked?.some((likedPlaylist) => likedPlaylist.playlist_id === playlistID) ??
    false;
  if (!myID) {
    return null;
  }
  return (
    <HeartIcon
      className={cn(
        "cursor-pointer",
        isPlaylistLiked && "fill-red-600",
        strokeColor && `stroke-${strokeColor}`
      )}
      size={size}
      onClick={async (e) => {
        e.stopPropagation();
        try {
          if (isPlaylistLiked) {
            await unlikePlaylist(supabase, myID, playlistID);
            mutateLiked((prev) =>
              prev?.filter((liked) => liked.playlist_id !== playlistID)
            );
          } else {
            await likePlaylist(supabase, myID, playlistID);
            mutateLiked();
          }
        } catch (e) {
          console.log(e);
        }
      }}
    />
  );
}
