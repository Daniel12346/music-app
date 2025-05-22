import { AlbumsWithArtists } from "@/lib/database";
import AlbumCard from "./album-card";

type Props = {
  albums: AlbumsWithArtists;
};
export default function Albums({ albums }: Props) {
  return (
    <div className="@container">
      <ul className="grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4">
        {albums.map((album) => (
          <li className="flex place-content-center" key={album.id}>
            <div className="">
              <AlbumCard
                cover_url={album.cover_url}
                title={album.title}
                id={album.id}
                artists={album.artists_albums.map((a) => a.artists)}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
