"use client";
import { getAlbumWithTracks } from "@/lib/database";
import { useTrackStore } from "@/store/track.store";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function Album({ id }: { id: string }) {
  const supabase = createClient();
  const { data, isLoading, error } = useSWR(["albumWithTracks", id], () =>
    getAlbumWithTracks(supabase, id)
  );
  const setTrackUrl = useTrackStore((state) => state.setTrackUrl);
  if (error) {
    return <div>Error loading album</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No album found</div>;
  }
  return (
    <div>
      <h1>Album</h1>
      <h2>{data.title}</h2>
      {data.cover_url && <img src={data.cover_url} alt={data.title} />}
      <h3>Tracks</h3>
      <ul>
        {data.tracks.map((track) => (
          <li
            className="bg-red-300"
            key={track.id}
            onClick={() => {
              console.log("Track clicked", track.url);
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
