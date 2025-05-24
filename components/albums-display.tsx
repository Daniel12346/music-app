import { AlbumsWithArtists } from "@/lib/database";
import AlbumCard from "./album-card";
import { SortKey } from "@/lib/types";
type Props = {
  albums: AlbumsWithArtists;
  showArtistName?: boolean;
  showReleasedAt?: boolean;
  sortKey?: SortKey;
};
export default function Albums({
  albums,
  showArtistName = true,
  showReleasedAt = false,
  sortKey = "newest_first",
}: Props) {
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
        {sortAlbumsByKey(albums, sortKey).map((album) => (
          <li className="flex place-content-center" key={album.id}>
            <div className="">
              <AlbumCard
                showArtistName={showArtistName}
                cover_url={album.cover_url}
                title={album.title}
                id={album.id}
                showReleasedAt={showReleasedAt}
                released_at={album.released_at}
                artists={album.artists_albums.map((a) => a.artists)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
