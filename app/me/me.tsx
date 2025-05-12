"use client";
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
  } = useSWR(myID ? "myLikedAlbums" : null, () =>
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
      <h1>My Albums</h1>
      <ul>
        {myLikedAlbums.map(({ album }) => (
          <li key={album.id}>
            <a href={`/albums/${album.id}`}>{album.title}</a>
            {album.cover_url && <img src={album.cover_url} alt={album.title} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
