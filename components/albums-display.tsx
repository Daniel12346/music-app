import { AlbumsWithArtists } from "@/lib/database";
import AlbumCard from "./album-card";
import { SortKey } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";
type Props = {
  albums: AlbumsWithArtists | null;
  showArtistName?: boolean;
  showReleasedAt?: boolean;
  sortKey?: SortKey;
  isLoading?: boolean;
};
export default function Albums({
  albums,
  showArtistName = true,
  showReleasedAt = false,
  sortKey = "newest_first",
  isLoading = true,
}: Props) {
  if (!albums && !isLoading) return null;
  const sortAlbumsByKey = (albums: AlbumsWithArtists, sortKey: SortKey) => {
    switch (sortKey) {
      case "newest_first":
        return albums.toSorted(
          (a, b) =>
            new Date(b.released_at).getTime() -
            new Date(a.released_at).getTime()
        );
      case "oldest_first":
        return albums.toSorted(
          (a, b) =>
            new Date(a.released_at).getTime() -
            new Date(b.released_at).getTime()
        );
      case "A-to-Z":
        return albums.toSorted((a, b) => a.title.localeCompare(b.title));
      case "Z-to-A":
        return albums.toSorted((a, b) => b.title.localeCompare(a.title));
    }
  };
  return (
    <div className="@container">
      <ul className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <li className="flex justify-center" key={i}>
                <Skeleton className="w-32 h-32 bg-slate-200" />
              </li>
            ))
          : sortAlbumsByKey(!albums ? [] : albums, sortKey).map((album) => (
              <li className="flex justify-center" key={album.id}>
                <AlbumCard
                  showArtistName={showArtistName}
                  cover_url={album.cover_url}
                  title={album.title}
                  id={album.id}
                  showReleasedAt={showReleasedAt}
                  released_at={album.released_at}
                  artists={album.artists_albums.map((a) => a.artists)}
                />
              </li>
            ))}
      </ul>
    </div>
  );
}
