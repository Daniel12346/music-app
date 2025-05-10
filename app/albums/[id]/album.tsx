"use client";
import { getAlbum, getAlbumWithTracks } from "@/app/features";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function Album({ id }: { id: string }) {
  const supabase = createClient();
  const { data, isLoading, error } = useSWR(["albumWithTracks", id], () =>
    getAlbumWithTracks(supabase, id)
  );
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
        {data.tracks.map((track: any) => (
          <li key={track.id}>
            <a href={`/tracks/${track.id}`}>{track.title}</a>
            {track.cover_url && <img src={track.cover_url} alt={track.title} />}
          </li>
        ))}
      </ul>
    </div>
  );
}
