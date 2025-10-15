"use client";
import { getTracksLikedByUser, likeTrack, unlikeTrack } from "@/lib/database";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { HeartIcon } from "lucide-react";
import useSWR from "swr";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

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
    liked?.some((likedTrack) => likedTrack.track_id === trackID) ?? false;

  if (!myID) {
    return null;
  }
  return (
    <Tooltip>
      <TooltipContent>{isTrackLiked ? "Unlike" : "Like"}</TooltipContent>
      <TooltipTrigger asChild>
        <HeartIcon
          className={cn(
            "cursor-pointer",
            isTrackLiked && "fill-red-600/70",
            strokeColor && `stroke-${strokeColor}`
          )}
          size={size}
          onClick={async (e) => {
            e.stopPropagation();
            if (isTrackLiked) {
              await unlikeTrack(supabase, myID, trackID, trackAlbumID);
              mutateLiked((prev) =>
                prev?.filter((liked) => liked.track_id !== trackID)
              );
            } else {
              await likeTrack(supabase, myID, trackID, trackAlbumID);
              mutateLiked();
            }
          }}
        />
      </TooltipTrigger>
    </Tooltip>
  );
}
