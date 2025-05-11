"use client";
import useSWR from "swr";
import { getAlbums } from "../../lib/database";
import { createClient } from "@/utils/supabase/client";

export default function Albums() {
  const supabase = createClient();
  const { data, error } = useSWR("albums", () => getAlbums(supabase));
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
    <div>
      <h1>Albums</h1>
      <ul>
        {data.map((album: any) => (
          <li key={album.id}>
            <a href={`/albums/${album.id}`}>{album.title}</a>
            <img src={album.cover_url} alt={album.title} />
          </li>
        ))}
      </ul>
    </div>
  );
}
