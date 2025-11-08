"use client";
import LikeTrack from "@/components/like-track";
import TrackArtists from "@/components/track-artists";
import {
  getNewTracksByLikedArtists,
  makeNewTracksPlaylist,
} from "@/lib/database";
import { addNewQueueIdToTrack } from "@/lib/utils";
import { useTrackStore } from "@/state/store";
import { createClient } from "@/utils/supabase/client";
import { ClockIcon, ListEndIcon, ListStartIcon } from "lucide-react";
import useSWR from "swr";
import PlaylistCard from "@/components/playlist-card";
import LikePlaylist from "@/components/like-playlist";

export default function NewReleasesPlaylist() {
  const supabase = createClient();
  const { data: myData } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = myData?.user?.id;

  const {
    data: newTracksByLikedArtists,
    error,
    isLoading,
  } = useSWR(myID ? ["getNewTracksByLikedArtists", myID] : null, () =>
    getNewTracksByLikedArtists(supabase, myID!)
  );
  const playlist = makeNewTracksPlaylist(newTracksByLikedArtists ?? null);
  const addTrackToQueue = useTrackStore((state) => state.addTrackToQueue);
  const addTracksToQueue = useTrackStore((state) => state.addTracksToQueue);
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);
  const setQueue = useTrackStore((state) => state.setQueue);
  const tracksWithExtraInfo = playlist?.playlists_tracks?.map(
    (playlists_tracks) => ({
      ...playlists_tracks.track,
      albumName: playlists_tracks.track_album.title,
      albumCoverUrl: playlists_tracks.track_album.cover_url!,
      albumId: playlists_tracks.track_album.id,
      artists: playlists_tracks.track.tracks_artists.map((trackArtist) => ({
        id: trackArtist.artists.id,
        name: trackArtist.artists.name,
      })),
      contributor: null,
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
          {...playlist}
          album_cover_urls={playlist.playlists_tracks.map(
            (playlist) => playlist.track_album.cover_url
          )}
          size="large"
          showCreatedAt
        />

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
      <ul className="w-full max-w-md space-y-2 md:space-y-1 border-t-2 p-2">
        {tracksWithExtraInfo?.map((track, idx) => (
          <li
            className="w-full  flex items-center justify-between px-2"
            key={track.id}
          >
            <div className="flex flex-col">
              <span
                className="text-lg font-light cursor-pointer"
                onClick={() => {
                  const tracksWithQueueIds = tracksWithExtraInfo.map((track) =>
                    addNewQueueIdToTrack(track)
                  );
                  const trackWithQueueId = tracksWithQueueIds[idx];
                  setCurrentTrack(trackWithQueueId, null, "NEW_RELEASES");
                  //clearing the queue and adding all the album tracks starting with the selected track
                  setQueue(tracksWithQueueIds.slice(idx));
                }}
              >
                {track.title}
              </span>
              <TrackArtists artists={track.artists} />
            </div>
            <div className="flex justify-end items-center gap-2 grow-0 shrink-0">
              <span className="text-md font-extralight w-fit">
                {track.length as string}
              </span>
              <ListStartIcon
                size={16}
                className="cursor-pointer opacity-80"
                onClick={(e) => {
                  //stopping propagation because the on click handle for the li element would set the clicked track as current and add unintened tracks to queue
                  e.stopPropagation();
                  addTrackToQueue(addNewQueueIdToTrack(track), "start");
                }}
              />
              <ListEndIcon
                size={16}
                className="opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  addTrackToQueue(addNewQueueIdToTrack(track), "end");
                }}
              />
              <LikeTrack trackID={track.id} trackAlbumID={track.albumId} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
