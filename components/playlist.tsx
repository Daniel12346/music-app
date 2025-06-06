import { PlaylistsWithPreview } from "@/lib/database";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
  id: string;
  name: string;
  image_url: string | null;
  playlists_tracks: PlaylistsWithPreview[0]["playlists_tracks"];
}
export default function Playlist({
  id,
  name,
  image_url,
  playlists_tracks,
}: Props) {
  return (
    <Link href={`/playlists/${id}`} key={id}>
      <span className="font-semibold">{name}</span>
      <div className="w-24 h-24 bg-muted">
        {/* //TODO: default image */}
        {image_url ? (
          <img
            src={image_url}
            width={10}
            height={10}
            className="cover w-full h-full rounded-md"
          />
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 border-1 border-muted-foreground rounded-md w-full">
            {playlists_tracks.slice(0, 4).map((playlistTrack, i) => {
              return (
                playlistTrack.albums.cover_url && (
                  <img
                    key={playlistTrack.track_id}
                    src={playlistTrack.albums.cover_url}
                    width={10}
                    height={10}
                    className={cn(
                      "w-full",
                      i === 0 && "rounded-tl-md",
                      i === 1 && "rounded-tr-md",
                      i === 2 && "rounded-bl-md",
                      i === 3 && "rounded-br-md"
                    )}
                  />
                )
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
