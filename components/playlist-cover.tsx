import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  alt: string;
  image_url?: string;
  album_cover_urls?: (string | null)[];
  size?: "small" | "large";
}
export default function PlaylistCover({
  alt,
  image_url,
  album_cover_urls,
  size,
}: Props) {
  return image_url ? (
    <Image
      src={image_url}
      alt={alt}
      width={120}
      height={120}
      className={cn("rounded-md w-full object-cover h-32", {
        "h-20 w-20": size === "small",
        "h-72 w-72": size === "large",
      })}
    />
  ) : (
    <div
      className={cn(
        "grid grid-cols-2 grid-rows-2  bg-muted border-1 border-muted-foreground rounded-md h-32 w-32",
        { "h-20 w-20": size === "small", "h-72 w-72": size === "large" }
      )}
    >
      {album_cover_urls?.slice(0, 4).map(
        (album_cover_url, i) =>
          album_cover_url && (
            <Image
              key={album_cover_url + i}
              src={album_cover_url}
              //TODO: add alt for each album
              alt="album cover"
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
  );
}
