"use client";
import { getAlbumsLikedByUser, unlikeAlbum, likeAlbum } from "@/lib/database";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { HeartIcon } from "lucide-react";
import useSWR from "swr";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function LikeAlbum({
  albumID,
  size = 16,
  strokeColor,
}: {
  albumID: string;
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
    myID ? ["getAlbumsLikedByUser", myID] : null,
    () => getAlbumsLikedByUser(supabase, myID)
  );
  const isAlbumLiked =
    liked?.some((likedAlbum) => likedAlbum.id === albumID) ?? false;

  if (!myID) {
    return null;
  }
  return (
    <Tooltip>
      <TooltipContent>{isAlbumLiked ? "Unlike" : "Like"}</TooltipContent>
      <TooltipTrigger asChild>
        <HeartIcon
          className={cn(
            "cursor-pointer",
            isAlbumLiked && "fill-red-600",
            strokeColor && `stroke-${strokeColor}`
          )}
          size={size}
          onClick={async (e) => {
            e.stopPropagation();
            if (isAlbumLiked) {
              await unlikeAlbum(supabase, myID, albumID);
              mutateLiked((prev) =>
                prev?.filter((liked) => liked.id !== albumID)
              );
            } else {
              await likeAlbum(supabase, myID, albumID);
              mutateLiked();
            }
          }}
        />
      </TooltipTrigger>
    </Tooltip>
  );
}
