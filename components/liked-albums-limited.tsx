"use client";
import { getAlbumsLikedByUser } from "@/lib/database";
import AlbumsDisplay from "./albums-display";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import Link from "next/link";

export default function LikedAlbumsLimited({ limit = 4 }: { limit?: number }) {
  const supabase = createClient();
  const { data: myData } = useSWR("me", async () => {
    const { data } = await supabase.auth.getUser();
    return data;
  });
  const myID = myData?.user?.id;
  const { data: myLikedAlbums } = useSWR(
    myID ? ["getAlbumsLikedByUser", myID, limit] : null,
    () => {
      return getAlbumsLikedByUser(supabase, myID!, limit);
    }
  );
  if (!myID) return null;
  return (
    <div>
      <div className="flex justify-between pr-6">
        <h2 className="mb-2 text-xl font-bold text-foreground/90">
          Liked albums
        </h2>
        <Link
          href="/albums/liked"
          className="hover:underline flex items-end pb-1 text-muted-foreground"
        >
          See all
        </Link>
      </div>
      <AlbumsDisplay albums={myLikedAlbums ?? null} />
    </div>
  );
}
