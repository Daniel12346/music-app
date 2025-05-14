"use client";
import useSWR from "swr";
import { getAlbums } from "../../lib/database";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import LikeAlbum from "@/components/likeAlbum";

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
    <div>
      <h1>Albums</h1>
      <ul>
        {data.map((album) => (
          <li key={album.id}>
            <Link href={`/albums/${album.id}`}>{album.title}</Link>
            {album.cover_url && (
              <img src={album.cover_url} alt={album.title} width={50} />
            )}

            <LikeAlbum albumID={album.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
