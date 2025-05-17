import { Tables } from "@/database.types";
import Link from "next/link";
import LikeAlbum from "./like-album";
import { cn } from "@/lib/utils";

type ArtistInfo = Pick<Tables<"artists">, "name" | "id">;
type Props = Pick<Tables<"albums">, "id" | "title" | "cover_url"> & {
  artists: ArtistInfo[];
  size?: "large";
};
export default function AlbumCard({
  id,
  title,
  cover_url,
  artists,
  size,
}: Props) {
  return (
    <div className={cn("w-[120px] group", size === "large" && "w-[300px]")}>
      <div className="truncate text-lg flex-col">
        <div className="-mb-2 font-extralight text-muted-foreground">
          {/* TODO: separator */}
          {artists.map((artist) => (
            <Link href={`/artists/${artist.id}`} key={artist.id}>
              <span className="">{artist.name}</span>
            </Link>
          ))}
        </div>
        <Link href={`/albums/${id}`}>
          <span>{title}</span>
        </Link>
      </div>
      <div className="relative">
        <img
          src={cover_url || ""}
          alt={title || ""}
          width={120}
          height={120}
          className="rounded-md w-full"
        />
        <div className="hidden group-hover:block absolute top-0 right-0">
          <LikeAlbum albumID={id} size={size === "large" ? 32 : 16} />
        </div>
      </div>
    </div>
  );
}