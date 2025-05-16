"use client";
import useSWR from "swr";
import { getAlbums } from "../../../lib/database";
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
    <div className="w-full">
      <h1>Albums</h1>
      <ul className="flex gap-4 flex-wrap  w-full">
        {data.map((album) => (
          //TODO: use AlbumCard
          <li key={album.id} className="w-32 ">
            <div className="truncate w-full text-lg">
              <Link href={`/albums/${album.id}`}>{album.title}</Link>
            </div>
            {album.cover_url && (
              <img
                className="self-center w-full"
                src={album.cover_url}
                alt={album.title}
                width={70}
              />
            )}

            <div className="self-end">
              <LikeAlbum albumID={album.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
