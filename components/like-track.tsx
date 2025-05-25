"use client";
import { getTracksLikedByUser, likeTrack, unlikeTrack } from "@/lib/database";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { HeartIcon } from "lucide-react";
import useSWR from "swr";

export default function LikeTrack({
  trackID,
  trackAlbumID,
  size = 16,
  strokeColor,
}: {
  trackID: string;
  trackAlbumID: string;
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
    myID ? ["getTracksLikedByUser", myID] : null,
    () => getTracksLikedByUser(supabase, myID)
  );
  const isTrackLiked =
    liked?.some((likedTrack) => likedTrack.id === trackID) ?? false;

  if (!myID) {
    return null;
  }
  return (
    <HeartIcon
      className={cn(
        "cursor-pointer",
        isTrackLiked && "fill-red-600",
        strokeColor && `stroke-${strokeColor}`
      )}
      size={size}
      onClick={async () => {
        if (isTrackLiked) {
          await unlikeTrack(supabase, myID, trackID, trackAlbumID);
          mutateLiked((prev) => prev?.filter((liked) => liked.id !== trackID));
        } else {
          await likeTrack(supabase, myID, trackID, trackAlbumID);
          mutateLiked();
        }
      }}
    />
  );
}
