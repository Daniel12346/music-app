"use client";
import AlbumCard from "@/components/album-card";
import LikeAlbum from "@/components/like-album";
import LikeTrack from "@/components/like-track";
import TrackArtists from "@/components/track-artists";
import { getAlbumWithTracksAndArtist } from "@/lib/database";
import { addNewQueueIdToTrack } from "@/lib/utils";
import { useTrackStore } from "@/state/store";
import { createClient } from "@/utils/supabase/client";
import { ClockIcon, ListEndIcon, ListStartIcon } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function Album() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const {
    data: albumWithTracks,
    isLoading,
    error,
  } = useSWR(["getAlbumWithTracksAndArtist", id], () =>
    getAlbumWithTracksAndArtist(supabase, id)
  );
  const addTrackToQueue = useTrackStore((state) => state.addTrackToQueue);
  const addTracksToQueue = useTrackStore((state) => state.addTracksToQueue);
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);
  const queueTracksFromSource = useTrackStore(
    (state) => state.queueTracksFromSource
  );
  const tracksWithExtraInfo = albumWithTracks?.tracks.map((track) => ({
    ...track,
    albumName: albumWithTracks.title,
    albumCoverUrl: albumWithTracks.cover_url!,
    albumId: albumWithTracks.id,
    //TODO: artists for specific track, not album
    artists: track.tracks_artists.map((trackArtist) => ({
      id: trackArtist.artists.id,
      name: trackArtist.artists.name,
    })),
  }));
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
    return <div>Error loading album</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!albumWithTracks) {
    return <div>No album found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-2">
        <AlbumCard
          id={albumWithTracks.id}
          title={albumWithTracks.title}
          cover_url={albumWithTracks.cover_url}
          artists={albumWithTracks.artists}
          size="large"
        />

        <div className="mt-2">
          <div className="flex items-center gap-2  justify-between">
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
            <div className="flex gap-2">
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
                className="cursor-pointer"
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
              <LikeAlbum albumID={albumWithTracks.id} size={22} />
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
                  setCurrentTrack(trackWithQueueId);
                  //clearing the queue and adding all the album tracks starting with the selected track
                  //TODO: add optional setting to add clicked track to queue without resetting queue
                  // setQueue(tracksWithQueueIds.slice(idx));
                  queueTracksFromSource(tracksWithQueueIds);
                }}
              >
                {track.title}
              </span>
              <TrackArtists artists={track.artists} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-md font-thin hidden md:block mr-1 text-md">
                {track.play_count} plays
              </span>
              <span className="text-md font-extralight">
                {track.length as string}
              </span>
              <ListStartIcon
                size={16}
                className="opacity-80"
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
