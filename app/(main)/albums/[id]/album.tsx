"use client";
import AlbumCard from "@/components/album-card";
import LikeAlbum from "@/components/like-album";
import { getAlbumWithTracksAndArtist, getAuthUser } from "@/lib/database";
import { useStore } from "@/state/store";
import { createClient } from "@/utils/supabase/client";
import { ListEndIcon, ListStartIcon } from "lucide-react";
import useSWR from "swr";

export default function Album({ id }: { id: string }) {
  const supabase = createClient();
  const {
    data: albumWithTracks,
    isLoading,
    error,
  } = useSWR(["getAlbumWithTracksAndArtist", id], () =>
    getAlbumWithTracksAndArtist(supabase, id)
  );
  const addTrackToQueue = useStore((state) => state.addToQueue);
  const setCurrentTrack = useStore((state) => state.setCurrentTrack);
  const setQueue = useStore((state) => state.setQueue);
  const tracksWithExtraInfo = albumWithTracks?.tracks.map((track) => ({
    ...track,
    albumName: albumWithTracks.title,
    albumCoverUrl: albumWithTracks.cover_url!,
    albumId: albumWithTracks.id,
    //TODO: artists for specific track, not album
    artists: albumWithTracks.artists,
  }));
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
      <AlbumCard
        id={albumWithTracks.id}
        title={albumWithTracks.title}
        cover_url={albumWithTracks.cover_url}
        artists={albumWithTracks.artists}
        size="large"
      />
      <ul className="w-full max-w-md space-y-2 md:space-y-0 border-t-2 p-2">
        {tracksWithExtraInfo?.map((track, idx) => (
          <li
            className="w-full h-8 cursor-pointer flex items-center justify-between p-2"
            key={track.id}
            onClick={() => {
              setCurrentTrack(track);
              //clearing the queue and adding all the album tracks starting with the selected track
              //TODO: add optional setting to add clicked track to queue instead of resetting queue
              setQueue(tracksWithExtraInfo.slice(idx));
            }}
          >
            <div>
              <span className="text-lg font-light">{track.title}</span>
              {/* TODO: artist names (not necessarily the same as album artist names - featured artists etc.)*/}
            </div>
            <div className="flex items-center gap-2">
              {/* TODO: correct type for length */}
              <span className="text-md font-extralight">
                {track.length as string}
              </span>
              <ListStartIcon
                size={16}
                className="opacity-80"
                onClick={() => addTrackToQueue(track, "start")}
              />
              <ListEndIcon
                size={16}
                className="opacity-80"
                onClick={() => addTrackToQueue(track, "end")}
              />
              {/* TODO: replace with LikeTrack */}
              <LikeAlbum albumID={id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
