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
    <div className="flex flex-col items-center gap-4">
      <AlbumCard
        id={albumWithTracks.id}
        title={albumWithTracks.title}
        cover_url={albumWithTracks.cover_url}
        artists={albumWithTracks.artists}
        size="large"
      />
      <ul className="w-full max-w-md space-y-2 md:space-y-0 border-t-2 p-2">
        {albumWithTracks.tracks.map((track) => (
          <li
            className="w-full h-8 flex items-center justify-between p-2"
            key={track.id}
            onClick={() => {
              setTrackUrl(track.url);
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
              <LikeAlbum albumID={id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
