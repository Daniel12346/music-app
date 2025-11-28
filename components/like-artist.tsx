"use client";
import {
  getArtistsLikedByUser,
  likeArtist,
  unlikeArtist,
} from "@/lib/database";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { HeartIcon } from "lucide-react";
import useSWR from "swr";
import { Tooltip, TooltipContent } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

export default function LikeArtist({
  artistID,
  size = 16,
  strokeColor,
}: {
  artistID: string;
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
    myID ? ["getArtistsLikedByUser", myID] : null,
    () => getArtistsLikedByUser(supabase, myID)
  );
  const isLiked =
    liked?.some((likedArtist) => likedArtist.artist_id === artistID) ?? false;

  if (!myID) {
    return null;
  }
  return (
    <Tooltip>
      <TooltipContent>{isLiked ? "Unlike" : "Like"}</TooltipContent>
      <TooltipTrigger asChild>
        <HeartIcon
          className={cn(
            "cursor-pointer",
            isLiked && "fill-red-600/70",
            strokeColor && `stroke-${strokeColor}`
          )}
          size={size}
          onClick={async (e) => {
            e.stopPropagation();
            if (isLiked) {
              await unlikeArtist(supabase, myID, artistID);
              mutateLiked((prev) =>
                prev?.filter((liked) => liked.artist_id !== artistID)
              );
            } else {
              await likeArtist(supabase, myID, artistID);
              mutateLiked();
            }
          }}
        />
      </TooltipTrigger>
    </Tooltip>
  );
}
