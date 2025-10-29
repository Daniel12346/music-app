"use client";

import { useRef } from "react";
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
import PlaylistCover from "./playlist-cover";
import { useTrackStore } from "@/state/store";
import { useRouter, usePathname } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const query = useTrackStore((state) => state.query);
  const setQuery = useTrackStore((state) => state.setQuery);
  const { data, error, isLoading } = useSWR(["search", query], () =>
    getSearchResults(supabase, query)
  );
  const albumsRes = data?.albums ?? null;
  const tracksRes = data?.tracks ?? null;
  const artistsRes = data?.artists ?? null;
  const playlistsRes = data?.playlists ?? null;
  const dropdownRef = useRef<HTMLDivElement>(null);
  return (
    <div className="max-w-lg w-full relative group" ref={dropdownRef}>
      <Input
        placeholder="Search..."
        className="w-full"
        value={query}
        onChange={(e) => {
          if (pathname !== "/search-results") router.push("/search-results");
          setQuery(e.target.value);
        }}
      />
      {/* TODO: add recent results or remove completely */}
      {/* <div className="absolute w-full  flex-col gap-1 max-h-120 overflow-y-scroll left-0  z-20 bg-accent hidden group-focus-within:flex shadow-md">
        {data === null && <div>Recent results:</div>}
        {albumsRes &&
          albumsRes.status === 200 &&
          albumsRes.data?.length !== 0 && (
            <div className="flex flex-col gap-2 p-2 border-b-2 border-slate-500/30">
              <div className="flex font-semibold font-sans">
                <DiscAlbumIcon className="mr-1" />
                Albums
              </div>
              {albumsRes?.data?.map((album) => (
                <div key={album.id}>
                  <Link
                    href={`/albums/${album.id}`}
                    onNavigate={() => setQuery("")}
                  >
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
                        <span className="text-s text-muted-foreground">
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
        {tracksRes &&
          tracksRes.status === 200 &&
          tracksRes.data?.length !== 0 && (
            <div className="flex flex-col gap-2 p-2 border-b-2 border-slate-500/30">
              <div className="flex  font-semibold font-sans">
                <MusicIcon className="mr-1" />
                Tracks
              </div>
              <div className="flex flex-col gap-2">
                {tracksRes?.data?.map((track) => (
                  <div key={track.id}>
                    <Link href={`/albums/${track.albums_tracks[0].albums.id}`}>
                      <div className="flex gap-1">
                        <img
                          className="rounded-sm"
                          src={track.albums_tracks[0].albums.cover_url || ""}
                          alt={track.albums_tracks[0].albums.title}
                          width={40}
                          height={40}
                        />
                        <div className="flex flex-col">
                          <span>{track.title}</span>
                          <span className="text-s text-muted-foreground">
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
            <div className="flex flex-col gap-2 p-2 border-b-2 border-slate-500/30">
              <div className="flex  font-semibold font-sans">
                <UserRoundIcon className="mr-1" />
                Artists
              </div>
              {artistsRes?.data?.map((artist) => (
                <div key={artist.id}>
                  <Link
                    href={`/artists/${artist.id}`}
                    onNavigate={() => setQuery("")}
                  >
                    <div className="flex flex-col gap-1 ">
                      <img
                        className="w-20 h-20 object-cover rounded-full"
                        src={artist.image_url || ""}
                        alt={artist.name}
                        width={20}
                        height={20}
                      />
                      <div className="flex flex-col">
                        <span className="text-lg">{artist.name}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        {playlistsRes &&
          playlistsRes.status === 200 &&
          playlistsRes.data?.length !== 0 && (
            <div className="flex flex-col gap-2 p-2 border-b-2 border-slate-500/30">
              <div className="flex  font-semibold font-sans">
                <ListMusicIcon className="mr-1" />
                Playlists
              </div>
              <div className="flex gap-1">
                {playlistsRes?.data?.map((playlist) => (
                  <div key={playlist.id}>
                    <Link
                      href={`/playlists/${playlist.id}`}
                      onNavigate={() => setQuery("")}
                    >
                      <div>
                        <PlaylistCover
                          alt={playlist.name || ""}
                          image_url={playlist.image_url || ""}
                          album_cover_urls={playlist.playlists_tracks.map(
                            (track) => track.track_album.cover_url
                          )}
                          size="small"
                        />
                        <div className="w-full">
                          <span className="truncate">{playlist.name}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div> */}
    </div>
  );
}
