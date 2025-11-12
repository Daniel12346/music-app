import { Tables } from "@/database.types";
import { cn } from "@/lib/utils";
import LikePlaylist from "./like-playlist";
import PlaylistCover from "./playlist-cover";
import { Avatar, AvatarImage } from "./ui/avatar";
import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react";
import Link from "next/link";

type Props = Tables<"playlists"> & {
  size?: "large" | "small";
  showCreatedAt?: boolean;
  album_cover_urls?: (string | null)[];
  owner?: {
    username: string | null;
    id: string;
    avatar_url: string | null;
  } | null;
  status: Tables<"playlists">["status"];
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
  status,
  showCreatedAt = false,
  isMain = false,
}: Props) {
  return (
    <div className={cn("w-32 min-h-32 group", size === "large" && "w-72")}>
      <Link href={`/playlists/${id}`} className="flex justify-center">
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
      </Link>
      <div className="flex items-baseline justify-between">
        <Link href={`/playlists/${id}`}>
          <span className={cn("line-clamp-2 min-h-6 text-lg/6 mt-1")}>
            {name}
          </span>
        </Link>
        {isMain && (
          <div className="flex items-baseline gap-0.5 text-foreground/70">
            {status === "PUBLIC" ? (
              <LockKeyholeOpenIcon size={14} />
            ) : (
              <LockKeyholeIcon size={14} />
            )}
            <span className="lowercase">{status}</span>
          </div>
        )}
      </div>
      <div className="text-muted-foreground flex items-center justify-between w-full mt-1 mb-1">
        {isMain ? (
          <div className="flex items-center">
            <div>
              <span>Created by </span>
              <Link
                href={`/profiles/${owner?.id}`}
                className="hover:underline font-normal cursor-pointer"
              >
                {owner?.username}
              </Link>
            </div>
            <Link
              href={`/profiles/${owner?.id}`}
              className="hover:underline font-normal cursor-pointer"
            >
              <Avatar className="w-8 h-8 ml-1">
                <AvatarImage
                  src={owner?.avatar_url || ""}
                  alt={owner?.username || ""}
                />
              </Avatar>
            </Link>
          </div>
        ) : (
          <Link
            href={`/profiles/${owner?.id}`}
            className="hover:underline font-normal cursor-pointer"
          >
            {owner?.username}
          </Link>
        )}
        {showCreatedAt && created_at && (
          <span className="">{new Date(created_at).getFullYear()}</span>
        )}
      </div>
    </div>
  );
}
