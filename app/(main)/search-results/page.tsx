"use client";
import AlbumsDisplay from "@/components/albums-display";
import { getSearchResults } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import PlaylistsGrid from "@/components/playlists-grid";
import {
  DiscAlbumIcon,
  ListMusicIcon,
  MusicIcon,
  UserRoundIcon,
  UserStarIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import LikeTrack from "@/components/like-track";
import TrackArtists from "@/components/track-artists";
import TrackOptionsButton from "@/components/track-options";
import { addNewQueueIdToTrack } from "@/lib/utils";
import { useTrackStore } from "@/state/store";

export default function SearchResults() {
  const supabase = createClient();
  const { query } = useTrackStore((state) => state);
  const { data, isLoading } = useSWR(
    ["getSearchResults", query],
    () => getSearchResults(supabase, query),
    { keepPreviousData: true }
  );
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);

  const albums = data?.albums ?? null;
  const playlists = data?.playlists ?? null;
  const tracks = data?.tracks ?? null;
  const artists = data?.artists ?? null;
  const profiles = data?.profiles ?? null;

  return (
    <div className="flex flex-col px-3 gap-6">
      <h1 className="text-lg">
        Search results for
        <span className="ml-1 font-semibold">{query}</span>
      </h1>
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-col">
          <div className="flex">
            <MusicIcon className="mr-1" />
            Tracks
          </div>
          <div className="px-6">
            {(tracks?.data?.length ?? 0) > 0 ? (
              <div className="md:grid md:grid-cols-2 md:gap-10">
                {tracks?.data?.map((track) => {
                  if (!track) return null;
                  const trackWithExtra = {
                    ...track,
                    albumCoverUrl:
                      track.albums_tracks[0].albums.cover_url || "",
                    albumId: track.albums_tracks[0].albums.id || "",
                    artists:
                      track.tracks_artists.map((artist) => artist.artists) ||
                      [],
                    albumName: track.albums_tracks[0].albums.title || "",
                  };

                  return (
                    <div
                      key={track.id}
                      className="flex cursor-pointer items-center gap-2  @container"
                      onClick={() =>
                        setCurrentTrack(
                          addNewQueueIdToTrack(trackWithExtra),
                          null,
                          null,
                          null
                        )
                      }
                    >
                      <img
                        src={trackWithExtra.albumCoverUrl || ""}
                        alt={track.title}
                        className="w-10 h-10 rounded"
                      />
                      <div className="flex-1 flex flex-col">
                        <span className="text-lg ">{track.title}</span>

                        <TrackArtists
                          artists={track.tracks_artists.map(
                            (artist) => artist.artists
                          )}
                        />
                      </div>

                      <div
                        className="flex items-center gap-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <TrackOptionsButton track={trackWithExtra} />
                        <LikeTrack
                          trackID={track.id}
                          trackAlbumID={trackWithExtra.albumId}
                        />
                        <XIcon />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center text-muted-foreground">
                No tracks found
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="flex">
            <ListMusicIcon className="mr-1" />
            Playlists
          </div>
          <div>
            {(playlists?.data?.length ?? 0) > 0 ? (
              <PlaylistsGrid
                playlists={playlists?.data ?? []}
                isLoading={false}
              />
            ) : (
              <span className="flex justify-center text-muted-foreground">
                No playlists found
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="flex">
            <DiscAlbumIcon className="mr-1" />
            Albums
          </div>
          <div>
            {(albums?.data?.length ?? 0) > 0 ? (
              <AlbumsDisplay albums={albums?.data ?? []} isLoading={false} />
            ) : (
              <span className="flex justify-center text-muted-foreground">
                No albums found
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <UserStarIcon className="mr-1" />
            Artists
          </div>
          <div className="px-6">
            {(artists?.data?.length ?? 0) > 0 ? (
              artists?.data?.map((artist) => (
                <div key={artist.id}>
                  <Link href={`/artists/${artist.id}`}>
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
              ))
            ) : (
              <div className="flex justify-center text-muted-foreground">
                No artists found
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <UserRoundIcon className="mr-1" />
          Profiles
        </div>
        <div className="px-6">
          {(profiles?.data?.length ?? 0) > 0 ? (
            profiles?.data?.map((artist) => (
              <div key={artist.id}>
                {/* TOODO: link to profile */}
                <Link href={`/profiles/${artist.id}`}>
                  <div className="flex flex-col gap-1 ">
                    <img
                      className="w-20 h-20 object-cover rounded-full"
                      src={artist.avatar_url || ""}
                      alt={artist.username || ""}
                      width={20}
                      height={20}
                    />
                    <div className="flex flex-col">
                      <span className="text-lg">{artist.username}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="flex justify-center text-muted-foreground">
              No profiles found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
