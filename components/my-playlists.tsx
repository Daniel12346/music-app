import {
  getNewTracksByLikedArtists,
  getUserPlaylistsWithPreview,
  makeNewTracksPlaylist,
} from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import PlaylistsDisplay from "./playlists-grid";

export default function MyPlaylists() {
  const supabase = createClient();
  const { data, isLoading: isMyDataLoading } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;
  const {
    data: myPlaylists,
    error: playlistsError,
    isLoading: arePlaylistsLoading,
  } = useSWR(myID ? ["getUserPlaylistsWithPreview", myID] : null, () =>
    getUserPlaylistsWithPreview(supabase, myID!)
  );
  const { data: newTracksByLikedArtists, isLoading: areNewTracksLoading } =
    useSWR(myID ? ["getNewTracksByLikedArtists", myID] : null, () =>
      getNewTracksByLikedArtists(supabase, myID!)
    );
  const newReleasesPlaylist = makeNewTracksPlaylist(
    newTracksByLikedArtists ?? null
  );
  const isLoading =
    isMyDataLoading || areNewTracksLoading || arePlaylistsLoading;
  if (playlistsError) return <div>Error loading playlists</div>;
  if (!isLoading && myPlaylists?.length === 0)
    return <div>No playlists found</div>;
  return (
    <PlaylistsDisplay
      playlists={[newReleasesPlaylist!, ...(myPlaylists || [])]}
      isLoading={isLoading}
    />
  );
}
