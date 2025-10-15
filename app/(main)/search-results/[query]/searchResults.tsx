"use client";
import AlbumsDisplay from "@/components/albums-display";
import { getSearchResults } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import useSWR from "swr";
import PlaylistsGrid from "@/components/playlists-grid";
import {
  DiscAlbumIcon,
  ListMusicIcon,
  MusicIcon,
  UserRoundIcon,
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
  const { query } = useParams<{ query: string }>();
  const { data, isLoading } = useSWR(["getSearchResults", query], () =>
    getSearchResults(supabase, query)
  );
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);

  const albums = data?.albums ?? null;
  const playlists = data?.playlists ?? null;
  const tracks = data?.tracks ?? null;
  const artists = data?.artists ?? null;

  return (
    <div className="px-3">
      <h1 className="text-lg">
        Search results for
        <span className="ml-1 font-semibold">{query}</span>
      </h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <div className="flex">
            <MusicIcon className="mr-1" />
            Tracks
          </div>
          {(tracks?.data?.length ?? 0) > 0 ? (
            tracks?.data?.map((track) => {
              if (!track) return null;
              const trackWithExtra = {
                ...track,
                albumCoverUrl: track.albums_tracks[0].albums.cover_url || "",
                albumId: track.albums_tracks[0].albums.id || "",
                artists:
                  track.tracks_artists.map((artist) => artist.artists) || [],
                albumName: track.albums_tracks[0].albums.title || "",
              };

              return (
                <div
                  key={track.id}
                  className="flex cursor-pointer items-center gap-2  @container"
                  onClick={
                    () => setCurrentTrack(addNewQueueIdToTrack(trackWithExtra)) // Add queueId to track
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
                      // size={size}
                      // strokeColor={strokeColor}
                      trackAlbumID={trackWithExtra.albumId}
                    />
                    <XIcon />
                  </div>
                </div>
              );
            })
          ) : (
            <div>No tracks found</div>
          )}
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
              <span>No playlists found</span>
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
              <span>No albums found</span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex">
            <UserRoundIcon className="mr-1" />
            Artists
          </div>
          <div>
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
              <div>No artists found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
