"use client";
import AlbumsDisplay from "@/components/albums-display";
import LikedAlbums from "@/components/liked-albums";
import MyPlaylists from "@/components/my-playlists";
import { getAlbumsLikedByUser } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function Home() {
  return (
    <div className="px-3">
      <h2 className="mb-2 text-xl font-bold text-foreground/90">
        Your playlists
      </h2>
      <div className="mb-4">
        <MyPlaylists />
      </div>
      <div>
        <LikedAlbums />
      </div>
    </div>
  );
}
