"use client";
import AlbumsDisplay from "@/components/albums-display";
import MyPlaylists from "@/components/my-playlists";
import { getAlbumsLikedByUser } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function Home() {
  const supabase = createClient();
  const { data, isLoading: isMyDataLoading } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;

  const {
    data: myLikedAlbums,
    error: albumsError,
    isLoading: areAlbumsLoading,
  } = useSWR(myID ? ["getAlbumsLikedByUser", myID] : null, () =>
    getAlbumsLikedByUser(supabase, myID)
  );
  if (albumsError) {
    return <div>Error loading albums</div>;
  }
  return (
    myID && (
      <div className="px-3">
        <h1 className="mb-2 text-xl font-bold text-foreground/90">
          Your playlists
        </h1>
        <div className="mb-4">
          <MyPlaylists />
        </div>
        <h1 className="mb-2 text-xl font-bold text-foreground/90">
          Liked albums
        </h1>
        <div className="">
          <AlbumsDisplay
            albums={myLikedAlbums ?? null}
            isLoading={isMyDataLoading || areAlbumsLoading}
          />
        </div>
      </div>
    )
  );
}
