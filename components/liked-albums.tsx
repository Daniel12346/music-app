import { getAlbumsLikedByUser } from "@/lib/database";
import useSWR from "swr";
import AlbumsDisplay from "./albums-display";
import { createClient } from "@/utils/supabase/client";

export default function LikedAlbums() {
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
    <>
      <h2 className="mb-2 text-xl font-bold text-foreground/90">
        Liked albums
      </h2>
      <div className="">
        <AlbumsDisplay
          albums={myLikedAlbums ?? null}
          isLoading={isMyDataLoading || areAlbumsLoading}
        />
      </div>
    </>
  );
}
