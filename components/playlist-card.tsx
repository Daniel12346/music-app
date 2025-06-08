import { Tables } from "@/database.types";
import Link from "next/link";
import LikeAlbum from "./like-album";
import { cn } from "@/lib/utils";

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
  console.log(album_cover_urls);
  return (
    <div className={cn("w-32 min-h-32 group", size === "large" && "w-72")}>
      <div className="relative">
        {image_url ? (
          <img
            src={image_url}
            alt={name || ""}
            width={120}
            height={120}
            className="rounded-md w-full"
          />
        ) : (
          <div className="grid grid-cols-2 grid-rows-2  bg-muted border-1 border-muted-foreground rounded-md w-full">
            {album_cover_urls
              ?.slice(0, 4)
              .map(
                (album_cover_url, i) =>
                  album_cover_url && (
                    <img
                      key={album_cover_url}
                      src={album_cover_url}
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
              )}
          </div>
        )}
        <div className="hidden group-hover:block absolute top-0 right-0">
          <LikeAlbum albumID={id} size={size === "large" ? 32 : 16} />
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
