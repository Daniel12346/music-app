import PlaylistCard from "./playlist-card";
import { PlaylistsWithPreview } from "@/lib/database";
import CreatePlaylist from "./create-playlist";
interface Props {
  playlists: PlaylistsWithPreview;
  isLoading?: boolean;
  withCreateNew?: boolean;
}

export default function PlaylistsGrid({ playlists, withCreateNew }: Props) {
  return (
    <div className="@container">
      <ul className="grid grid-cols-2 justify-items-center @md:grid-cols-3 @lg:grid-cols-4 gap-y-6">
        {withCreateNew && <CreatePlaylist />}
        {playlists?.map(
          (playlist) =>
            playlist && (
              <PlaylistCard
                {...playlist}
                key={playlist.id}
                album_cover_urls={playlist.playlists_tracks.map(
                  (playlist) => playlist.track_album.cover_url
                )}
              />
            )
        )}
       
      </ul>
    </div>
  );
}
