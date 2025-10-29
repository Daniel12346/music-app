import { Tables } from "@/database.types";
import { cn } from "@/lib/utils";
import LikePlaylist from "./like-playlist";
import PlaylistCover from "./playlist-cover";
import { Avatar, AvatarImage } from "./ui/avatar";

type Props = Tables<"playlists"> & {
  size?: "large" | "small";
  showCreatedAt?: boolean;
  album_cover_urls?: (string | null)[];
  owner?: {
    username: string | null;
    id: string;
    avatar_url: string | null;
  } | null;
  isMain?: boolean;
};
export default function PlaylistCard({
  id,
  owner,
  name,
  image_url,
  album_cover_urls,
  size,
  created_at,
  showCreatedAt = false,
  isMain = false,
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
      <span className={cn("line-clamp-2 min-h-6 text-lg/6 mt-1")}>{name}</span>
      <div className="text-muted-foreground flex items-center justify-between w-full">
        {isMain ? (
          <div className="flex items-center">
            <div>
              <span>Created by {/* TODO: add link */}</span>
              <span className="hover:underline font-normal cursor-pointer">
                {owner?.username}
              </span>
            </div>
            <Avatar className="w-8 h-8 ml-1">
              <AvatarImage
                src={owner?.avatar_url || ""}
                alt={owner?.username || ""}
              />
            </Avatar>
          </div>
        ) : (
          <span className="hover:underline font-normal cursor-pointer">
            {owner?.username}
          </span>
        )}
        {showCreatedAt && created_at && (
          <span className="">{new Date(created_at).getFullYear()}</span>
        )}
      </div>
    </div>
  );
}
