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
            <li
              className="flex justify-center opacity-90 dark:opacity-40"
              key={i}
            >
              <div className="w-32">
                <Skeleton className="w-full h-32 bg-slate-500" />
                <Skeleton className="w-full mt-1 h-6 bg-slate-500" />
              </div>
            </li>
          ))
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
