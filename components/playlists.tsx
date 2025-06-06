import { getUserPlaylists, getUserPlaylistsWithPreview } from "@/lib/database";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import useSWR from "swr";
import Playlist from "./playlist";

export default function Playlists() {
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
  return myPlaylists?.map((playlist) => (
    <Playlist key={playlist.id} {...playlist} />
  ));
}
