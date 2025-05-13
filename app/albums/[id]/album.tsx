"use client";
import LikeAlbum from "@/components/likeAlbum";
import { getAlbumWithTracks, getMyAuthUserData } from "@/lib/database";
import { useStore } from "@/state/store";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function Album({ id }: { id: string }) {
  const supabase = createClient();
  const {
    data: albumWithTracks,
    isLoading,
    error,
  } = useSWR(["albumWithTracks", id], () => getAlbumWithTracks(supabase, id));
  useSWR("me", () => getMyAuthUserData(supabase));
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
        <img src={albumWithTracks.cover_url} alt={albumWithTracks.title} />
      )}
      <h3>Tracks</h3>
      <ul>
        {albumWithTracks.tracks.map((track) => (
          <li
            className="bg-red-300"
            key={track.id}
            onClick={() => {
              setTrackUrl(track.url);
            }}
          >
            <span>{track.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
