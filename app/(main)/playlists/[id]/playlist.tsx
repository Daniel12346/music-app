"use client";
import { getPlaylist } from "@/lib/database";
import { addNewQueueIdToTrack } from "@/lib/utils";
import { useTrackStore } from "@/state/store";
import { createClient } from "@/utils/supabase/client";
import { ClockIcon, ListEndIcon, ListStartIcon, PlusIcon } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import PlaylistCard from "@/components/playlist-card";
import LikePlaylist from "@/components/like-playlist";
import { Button } from "@/components/ui/button";
import TracksList from "@/components/tracks-list";

export default function Playlist() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const {
    data: playlist,
    isLoading,
    error,
  } = useSWR(["getPlaylist", id], () => getPlaylist(supabase, id));
  const { data } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;

  const canIEditPlaylist =
    playlist?.owner_id === myID ||
    playlist?.playlists_shared_with_users.some(
      (sharedWithUser) =>
        sharedWithUser.shared_with_user_id === myID && sharedWithUser.can_edit
    );
  const addTracksToQueue = useTrackStore((state) => state.addTracksToQueue);
  const tracksWithExtraInfo = playlist?.playlists_tracks?.map(
    (playlists_tracks) => ({
      ...playlists_tracks.tracks,
      albumName: playlists_tracks.albums.title,
      albumCoverUrl: playlists_tracks.albums.cover_url!,
      albumId: playlists_tracks.albums.id,
      artists: playlists_tracks.tracks.tracks_artists.map((trackArtist) => ({
        id: trackArtist.artists.id,
        name: trackArtist.artists.name,
      })),
      contributor: playlists_tracks.contributor,
    })
  );
  const totalDurationInSeconds =
    tracksWithExtraInfo?.reduce((acc, track) => {
      const [hours, minutes, seconds] = (track.length as string).split(":");
      const totalSeconds =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
      return acc + totalSeconds;
    }, 0) ?? 0;
  //formatted total duration in hours, minutes, seconds
  const totalDuration = new Date(totalDurationInSeconds * 1000)
    .toISOString()
    .slice(11, 19);

  if (error) {
    return <div>Error loading playlist</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!playlist) {
    return <div>No playlist found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-2">
        <PlaylistCard
          isMain
          {...playlist}
          album_cover_urls={playlist.playlists_tracks.map(
            (playlist) => playlist.albums.cover_url
          )}
          size="large"
          showCreatedAt
        />
        {canIEditPlaylist && (
          <Button variant="outline">
            <PlusIcon size={12} /> Add track
          </Button>
        )}
        <div className="mt-2">
          <div className="flex items-center gap-2 cursor-pointer justify-between">
            <div className="flex">
              <div className="flex gap-1 items-center">
                <ClockIcon size={20} />
                {totalDuration}
              </div>
              <div className="flex gap-1 items-center">
                ,
                <span>
                  {tracksWithExtraInfo?.length}{" "}
                  {tracksWithExtraInfo?.length.toString().endsWith("1")
                    ? "track"
                    : "tracks"}
                </span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <ListStartIcon
                className="cursor-pointer"
                size={22}
                onClick={() => {
                  addTracksToQueue(
                    tracksWithExtraInfo?.map((track) =>
                      addNewQueueIdToTrack(track)
                    )!,
                    "start"
                  );
                }}
              />
              <ListEndIcon
                size={22}
                onClick={() => {
                  addTracksToQueue(
                    tracksWithExtraInfo?.map((track) =>
                      addNewQueueIdToTrack(track)
                    )!,
                    "end"
                  );
                }}
              />
              <LikePlaylist playlistID={playlist.id} />{" "}
            </div>
          </div>
        </div>
      </div>
      <TracksList
        tracks={tracksWithExtraInfo ?? []}
        sourceName={playlist.name}
        sourceType="PLAYLIST"
        sourceId={playlist.id}
      />
    </div>
  );
}
