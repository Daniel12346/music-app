"use client";
import AlbumsDisplay from "@/components/albums-display";
import { getAlbumsLikedByUser } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function Me() {
  const supabase = createClient();
  const { data } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;

  const {
    data: myLikedAlbums,
    error,
    isLoading,
  } = useSWR(myID ? ["getAlbumsLikedByUser", myID] : null, () =>
    getAlbumsLikedByUser(supabase, myID)
  );
  if (error) {
    return <div>Error loading albums</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!myLikedAlbums) {
    return <div>No albums found</div>;
  }
  return (
    <div>
      <h1>Liked albums</h1>
      <AlbumsDisplay albums={myLikedAlbums} />
    </div>
  );
}
