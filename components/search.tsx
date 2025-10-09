"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { getSearchResults } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import {
  DiscAlbumIcon,
  ListMusicIcon,
  MusicIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";

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
  return (
    <div className="max-w-lg w-full relative group">
      <Input
        placeholder="Search..."
        className="w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="absolute w-full  flex-col max-h-120 overflow-y-scroll left-0  z-20 bg-accent hidden group-focus-within:flex shadow-md">
        {albumsRes &&
          albumsRes.status === 200 &&
          albumsRes.data?.length !== 0 && (
            <div className="flex flex-col gap-1 p-2">
              <div className=" flex">
                <DiscAlbumIcon className="mr-1" />
                Albums
              </div>
              {albumsRes?.data?.map((album) => (
                <div key={album.id}>
                  <Link href={`/albums/${album.id}`}>
                    <div className="flex gap-1">
                      <img
                        className="rounded-sm"
                        src={album.cover_url || ""}
                        alt={album.title}
                        width={40}
                        height={40}
                      />
                      <div className="flex flex-col ">
                        <span>{album.title}</span>
                        <span className="text-s">
                          {album.artists
                            ?.map((artist) => artist.name)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        {/* TODO: play track on click or open album with track highlighted */}
        {tracksRes &&
          tracksRes.status === 200 &&
          tracksRes.data?.length !== 0 && (
            <div className="flex flex-col gap-1 p-2">
              <div className=" flex">
                <MusicIcon className="mr-1" />
                Tracks
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:overflow-x-scroll">
                {tracksRes?.data?.map((track) => (
                  <div key={track.id}>
                    <Link href={`/track/${track.id}`}>
                      <div className="flex gap-1">
                        <img
                          className="rounded-sm"
                          src={track.albums_tracks[0].albums.cover_url || ""}
                          alt={track.albums_tracks[0].albums.title}
                          width={40}
                          height={40}
                        />
                        <div className="flex flex-col ">
                          <span>{track.title}</span>
                          <span className="text-s">
                            {track.tracks_artists
                              ?.map(({ artists }) => artists.name)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        {artistsRes &&
          artistsRes.status === 200 &&
          artistsRes.data?.length !== 0 && (
            <div className="flex flex-col gap-1 p-2">
              <div className=" flex">
                <UserRoundIcon className="mr-1" />
                Artists
              </div>
              {artistsRes?.data?.map((artist) => (
                <div key={artist.id}>
                  <Link href={`/artists/${artist.id}`}>{artist.name}</Link>
                </div>
              ))}
            </div>
          )}
        {playlistsRes &&
          playlistsRes.status === 200 &&
          playlistsRes.data?.length !== 0 && (
            <div className="flex flex-col gap-1 p-2">
              <div className=" flex">
                <ListMusicIcon className="mr-1" />
                Playlists
              </div>
              {playlistsRes?.data?.map((playlist) => (
                <div key={playlist.id}>
                  <Link href={`/playlists/${playlist.id}`}>
                    {playlist.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
