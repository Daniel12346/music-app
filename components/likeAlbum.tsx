"use client";
import {
  getMyAuthUserData,
  getAlbumsLikedByUser,
  unlikeAlbum,
  likeAlbum,
} from "@/lib/database";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { HeartIcon } from "lucide-react";
import useSWR from "swr";

export default function LikeAlbum({
  albumID,
  size = 16,
}: {
  albumID: string;
  size?: number;
}) {
  const supabase = createClient();
  const { data: myData } = useSWR("me", async () => {
    const { data } = await supabase.auth.getUser();
    return data;
  });
  const myID = myData?.user?.id;
  const { data: liked, mutate: mutateLiked } = useSWR(
    myID ? "myLikedAlbums" : null,
    () => getAlbumsLikedByUser(supabase, myID)
  );

  const isAlbumLiked =
    liked?.some((liked) => liked.album_id === albumID) ?? false;
  if (!myID) {
    return null;
  }
  return (
    <HeartIcon
      className={cn("cursor-pointer", isAlbumLiked && "fill-red-600")}
      size={size}
      onClick={async () => {
        if (isAlbumLiked) {
          await unlikeAlbum(supabase, myID, albumID);
          mutateLiked((prev) =>
            prev?.filter((liked) => liked.album_id !== albumID)
          );
        } else {
          await likeAlbum(supabase, myID, albumID);
          mutateLiked();
        }
      }}
    />
  );
}
