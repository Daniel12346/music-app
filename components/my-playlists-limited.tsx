"use client";
import {
  getNewTracksByLikedArtists,
  getUserPlaylistsWithPreview,
  makeNewTracksPlaylist,
} from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import PlaylistsDisplay from "./playlists-grid";
import Link from "next/link";

export default function MyPlaylistsLimited({ limit = 4 }: { limit?: number }) {
  const supabase = createClient();
  const { data: myData } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = myData?.user?.id;
  const { data: myPlaylists, error: playlistsError } = useSWR(
    myID ? ["getUserPlaylistsWithPreview", myID, limit] : null,
    () => getUserPlaylistsWithPreview(supabase, myID!, limit)
  );
  const { data: newTracksByLikedArtists } = useSWR(
    myID ? ["getNewTracksByLikedArtists", myID] : null,
    () => getNewTracksByLikedArtists(supabase, myID!)
  );
  const newReleasesPlaylist = makeNewTracksPlaylist(
    newTracksByLikedArtists ?? null
  );
  const playlists = [newReleasesPlaylist!, ...(myPlaylists || [])];
  if (playlistsError) return <div>Error loading playlists</div>;
  if (!myID) return null;
  return (
    <div>
      <div className="flex justify-between pr-6">
        <h2 className="mb-2 text-xl font-bold text-foreground/90">
          Your playlists
        </h2>
        <Link
          href="/playlists/me"
          className="hover:underline flex items-end pb-1 text-muted-foreground"
        >
          See all
        </Link>
      </div>
      <PlaylistsDisplay playlists={playlists} />;
    </div>
  );
}
