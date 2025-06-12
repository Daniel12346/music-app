"use client";
import AlbumsDisplay from "@/components/albums-display";
import Playlists from "@/components/playlists";
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
    error: albumsError,
    isLoading: albumsLoading,
  } = useSWR(myID ? ["getAlbumsLikedByUser", myID] : null, () =>
    getAlbumsLikedByUser(supabase, myID)
  );

  if (albumsError) {
    return <div>Error loading albums</div>;
  }
  if (albumsLoading) {
    return <div>Loading...</div>;
  }
  if (!myLikedAlbums) {
    return <div>No albums found</div>;
  }
  return (
    <div className="px-1">
      <h1>Playlists</h1>
      <div className="mb-4">
        <Playlists />
      </div>
      <h1>Liked albums</h1>
      <div className="">
        <AlbumsDisplay albums={myLikedAlbums} />
      </div>
    </div>
  );
}
