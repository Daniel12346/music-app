"use client";
import LikeAlbum from "@/components/likeAlbum";
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
  useSWR("getAuthUser", () => getAuthUser(supabase));
  const setTrackUrl = useStore((state) => state.setTrackUrl);
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
    <div>
      <h1>Album</h1>
      <h2>{albumWithTracks.title}</h2>
      <div className="justify-end flex">
        <LikeAlbum albumID={albumWithTracks.id} />
      </div>

      {albumWithTracks.cover_url && (
        <img
          src={albumWithTracks.cover_url}
          alt={albumWithTracks.title}
          width={50}
        />
      )}
      <h3>Tracks</h3>
      <ul>
        {albumWithTracks.tracks.map((track) => (
          <li
            className="bg-red-300 flex items-center justify-between p-2"
            key={track.id}
            onClick={() => {
              setTrackUrl(track.url);
            }}
          >
            <div>
              <span className="text-lg">{track.title}</span>
              {/* TODO: artist names (not necessarily the same as album artist names - featured artists etc.)*/}
            </div>
            <div className="flex items-center gap-2">
              {/* TODO: correct type for length */}
              <span className="text-md font-light">
                {track.length as string}
              </span>
              <ListStartIcon size={16} />
              <ListEndIcon
                size={16}
                onClick={() =>
                  addTrackToQueue({
                    ...track,
                    albumId: albumWithTracks.id,
                    albumCoverUrl: albumWithTracks.cover_url || "",
                    albumName: albumWithTracks.title,
                    artists: albumWithTracks.artists.map((artist) => ({
                      name: artist.name,
                      id: artist.id,
                    })),
                  })
                }
              />
              {/* TODO: replace with LikeTrack */}
              <LikeAlbum size={16} albumID={id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
