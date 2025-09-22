import { getUserPlaylistsWithPreview } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import PlaylistsDisplay from "./playlists-display";
//TODO: playlist with new releases

export default function MyPlaylists() {
  const supabase = createClient();
  const { data } = useSWR("me", () =>
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
  if (arePlaylistsLoading) return <div>Loading...</div>;
  if (playlistsError) return <div>Error loading playlists</div>;
  if (!myPlaylists) return <div>No playlists found</div>;
  return <PlaylistsDisplay playlists={myPlaylists} />;
}
