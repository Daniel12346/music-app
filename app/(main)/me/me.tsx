"use client";
import AlbumCard from "@/components/album-card";
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
      <div className="">
        <ul className="grid grid-cols-2 lg:grid-cols-3">
          {myLikedAlbums.map((album) => (
            <li className="flex place-content-center" key={album.id}>
              <AlbumCard
                id={album.id}
                title={album.title}
                cover_url={album.cover_url!}
                artists={album.artists_albums.map((a) => a.artists)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
