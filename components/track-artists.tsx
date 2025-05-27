import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TrackArtists({
  artists,
  textColor,
}: {
  artists: { name: string; id: string }[];
  textColor?: string;
}) {
  return (
    <div className="flex flex-wrap">
      {artists.map((artist, i) => (
        <span
          key={artist.id}
          className={cn(textColor || "text-gray-500 dark:text-gray-400")}
        >
          {(i > 0 && ", ") || ""}
          <Link href={`/artists/${artist.id}`}>
            <span className="hover:underline">{artist.name}</span>
          </Link>
        </span>
      ))}
    </div>
  );
}
