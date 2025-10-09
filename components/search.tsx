"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { getSearchResults } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function Search() {
  const supabase = createClient();
  const [query, setQuery] = useState("");
  const { data, error, isLoading } = useSWR(["search", query], () =>
    getSearchResults(supabase, query)
  );
  const albumsRes = data?.albums ?? null;
  const tracksRes = data?.tracks ?? null;
  const artistsRes = data?.artists ?? null;
  const playlistsRes = data?.playlists ?? null;
  console.log(albumsRes);
  return (
    <div className="max-w-lg w-full relative group">
      <Input
        placeholder="Search..."
        className="w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="absolute w-full flex-col max-h-120 overflow-y-scroll left-0  z-20 bg-accent hidden group-focus-within:flex shadow-md">
        {albumsRes && albumsRes.status === 200 && albumsRes.data && (
          <div className="flex flex-col gap-2 p-2">
            <div className="font-semibold">Albums</div>
            {albumsRes.data.map((album: any) => (
              <div key={album.id}>
                <a href={`/albumsRes/${album.id}`}>{album.title}</a>
              </div>
            ))}
          </div>
        )}
        {tracksRes && tracksRes.status === 200 && tracksRes.data && (
          <div className="flex flex-col gap-2 p-2">
            <div className="font-semibold">Tracks</div>
            {tracksRes.data.map((track: any) => (
              <div key={track.id}>
                <a href={`/tracks/${track.id}`}>{track.title}</a>
              </div>
            ))}
          </div>
        )}
        {artistsRes && artistsRes.status === 200 && artistsRes.data && (
          <div className="flex flex-col gap-2 p-2">
            <div className="font-semibold">Artists</div>
            {artistsRes.data.map((artist: any) => (
              <div key={artist.id}>
                <a href={`/artists/${artist.id}`}>{artist.name}</a>
              </div>
            ))}
          </div>
        )}
        {playlistsRes && playlistsRes.status === 200 && playlistsRes.data && (
          <div className="flex flex-col gap-2 p-2">
            <div className="font-semibold">Playlists</div>
            {playlistsRes.data.map((playlist: any) => (
              <div key={playlist.id}>
                <a href={`/playlists/${playlist.id}`}>{playlist.title}</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
