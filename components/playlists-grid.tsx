import Link from "next/link";
import PlaylistCard from "./playlist-card";
import { PlaylistsWithPreview } from "@/lib/database";
import { Skeleton } from "./ui/skeleton";
interface Props {
  playlists: PlaylistsWithPreview;
  isLoading?: boolean;
}

export default function PlaylistsGrid({ playlists, isLoading = true }: Props) {
  return (
    <div className="@container">
      <div className="grid grid-cols-2 gap-y-4 md:gap-y-0 @md:grid-cols-3 @lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <li className="flex justify-center" key={i}>
              <Skeleton className="w-32 h-32 bg-slate-200" />
            </li>
          ))
        ) : (
          <>
            {playlists?.map(
              (playlist) =>
                playlist && (
                  <Link
                    href={`/playlists/${playlist.id}`}
                    key={playlist.id}
                    className="flex justify-center"
                  >
                    <PlaylistCard
                      {...playlist}
                      album_cover_urls={playlist.playlists_tracks.map(
                        (playlist) => playlist.track_album.cover_url
                      )}
                    />
                  </Link>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
}
