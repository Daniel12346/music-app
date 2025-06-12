import { getUserPlaylistsWithPreview } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import PlaylistCard from "./playlist-card";
import Link from "next/link";
//TODO:
// import Playlist from "./playlist";

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
  return (
    <div className="@container">
      <div className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4">
        {myPlaylists?.map((playlist) => (
          <Link
            href={`/playlists/${playlist.id}`}
            key={playlist.id}
            className="flex justify-center"
          >
            <PlaylistCard
              {...playlist}
              album_cover_urls={playlist.playlists_tracks.map(
                (playlist) => playlist.albums.cover_url
              )}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
