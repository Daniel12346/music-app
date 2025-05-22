"use client";
import useSWR from "swr";
import { getAlbums } from "../../../lib/database";
import { createClient } from "@/utils/supabase/client";
import AlbumCard from "@/components/album-card";

export default function Albums() {
  const supabase = createClient();
  const { data, error } = useSWR("getAlbums", () => getAlbums(supabase));
  if (error) {
    return <div>Error loading albums</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }
  if (data.length === 0) {
    return <div>No albums found</div>;
  }
  return (
    <div className="@container">
      <h1>Albums</h1>
      <ul className="grid grid-cols-2 @lg:grid-cols-3">
        {data.map((album) => (
          //TODO: use AlbumCard
          <li className="flex place-content-center" key={album.id}>
            <div className="">
              <AlbumCard
                cover_url={album.cover_url}
                title={album.title}
                id={album.id}
                artists={album.artists_albums.map((a) => a.artists)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
