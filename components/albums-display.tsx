import { AlbumsWithArtists } from "@/lib/database";
import AlbumCard from "./album-card";

type Props = {
  albums: AlbumsWithArtists;
  showArtistName?: boolean;
  showReleasedAt?: boolean;
};
export default function Albums({
  albums,
  showArtistName = true,
  showReleasedAt = false,
}: Props) {
  return (
    <div className="@container">
      <ul className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4">
        {albums.map((album) => (
          <li className="flex place-content-center" key={album.id}>
            <div className="">
              <AlbumCard
                showArtistName={showArtistName}
                cover_url={album.cover_url}
                title={album.title}
                id={album.id}
                released_at={showReleasedAt ? album.released_at : null}
                artists={album.artists_albums.map((a) => a.artists)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
