import { Tables } from "@/database.types";
import { cn } from "@/lib/utils";
import LikePlaylist from "./like-playlist";
import PlaylistCover from "./playlist-cover";

type Props = Tables<"playlists"> & {
  size?: "large";
  showCreatedAt?: boolean;
  album_cover_urls?: (string | null)[];
};
export default function PlaylistCard({
  id,
  name,
  image_url,
  album_cover_urls,
  size,
  created_at,
  showCreatedAt = false,
}: Props) {
  return (
    <div className={cn("w-32 min-h-32 group", size === "large" && "w-72")}>
      <div className="relative">
        <PlaylistCover
          alt={name}
          image_url={image_url ?? undefined}
          album_cover_urls={album_cover_urls}
          size={size}
        />
        <div className="hidden group-hover:block absolute top-0 right-0">
          <LikePlaylist playlistID={id} size={size === "large" ? 32 : 16} />
        </div>
      </div>
      <div className="text-muted-foreground">
        {showCreatedAt && created_at && (
          <span className="">{new Date(created_at).getFullYear()}</span>
        )}
      </div>
      <div className="font-semibold line-clamp-2 min-h-6">{name}</div>
    </div>
  );
}
