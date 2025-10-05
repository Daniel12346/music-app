import { Tables } from "@/database.types";
import Link from "next/link";
import LikeAlbum from "./like-album";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNowStrict } from "date-fns";

type ArtistInfo = Pick<Tables<"artists">, "name" | "id">;
type Props = Pick<Tables<"albums">, "id" | "title" | "cover_url"> & {
  released_at?: Pick<Tables<"albums">, "released_at">["released_at"] | null;
  artists: ArtistInfo[];
  size?: "large";
  showArtistName?: boolean;
  showReleasedAt?: boolean;
};
export default function AlbumCard({
  id,
  title,
  cover_url,
  artists,
  size,
  released_at,
  showArtistName = true,
  showReleasedAt = false,
}: Props) {
  return (
    <div className={cn("w-32 group", size === "large" && "w-72")}>
      <div className="relative">
        {size !== "large" ? (
          <Link href={`/albums/${id}`}>
            <img
              src={cover_url || ""}
              alt={title || ""}
              width={120}
              height={120}
              className="rounded-md w-full"
            />
          </Link>
        ) : (
          <img
            src={cover_url || ""}
            alt={title || ""}
            width={120}
            height={120}
            className="rounded-md w-full"
          />
        )}
        <div className="hidden group-hover:block absolute top-0 right-0">
          <LikeAlbum albumID={id} size={size === "large" ? 32 : 16} />
        </div>
      </div>
      <div className="text-muted-foreground">
        {showReleasedAt && released_at && (
          <div className="flex justify-between mt-1">
            {new Date(released_at) >= new Date() ? (
              <span className="w-full bg-amber-200 text-slate-800 px-1 text-sm rounded-sm">
                {"Out "}
                {new Date(released_at).getFullYear() -
                  new Date().getFullYear() >
                1
                  ? format(released_at, "dd MMMM yyyy")
                  : format(released_at, "dd MMMM")}
              </span>
            ) : (
              <span className="">{new Date(released_at).getFullYear()}</span>
            )}
          </div>
        )}
      </div>
      <div className="truncate text-lg flex-col">
        <Link href={`/albums/${id}`}>
          <span>{title}</span>
        </Link>
        {showArtistName && (
          <div className="font-extralight text-muted-foreground">
            {artists.map((artist) => (
              <Link href={`/artists/${artist.id}`} key={artist.id}>
                <span>{artist.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
