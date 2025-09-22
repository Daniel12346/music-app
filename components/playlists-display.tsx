import Link from "next/link";
import PlaylistCard from "./playlist-card";
import { PlaylistsWithPreview } from "@/lib/database";
interface Props {
  playlists: PlaylistsWithPreview;
}

export default function PlaylistsDisplay({ playlists }: Props) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4">
        {playlists?.map((playlist) => (
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
