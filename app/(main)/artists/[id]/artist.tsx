"use client";
import AlbumsDisplay from "@/components/albums-display";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getArtistWithAlbumsAndTopTracks } from "@/lib/database";
import { SortKey } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function Artist() {
  const client = createClient();
  const { id } = useParams<{ id: string }>();
  const { data: artist, error } = useSWR(
    ["getArtistWithAlbumsAndTopTracks", id],
    () => getArtistWithAlbumsAndTopTracks(client, id)
  );
  const sortKeys: SortKey[] = [
    "newest_first",
    "oldest_first",
    "A-to-Z",
    "Z-to-A",
  ];
  const [currentSortKey, setCurrentSortKey] = useState<SortKey>("newest_first");
  return (
    <div>
      <div className="relative">
        <img
          src={artist?.image_url || ""}
          width={300}
          height={50}
          className="w-full h-40 object-cover object-top"
        />
        <h1 className="absolute bottom-0.5 left-0.5 z-10 text-6xl text-white text-shadow-accent">
          {artist?.name}
        </h1>
      </div>
      <div className="flex items-baseline-last pl-2 pt-4 mb-2">
        <span className="text-2xl opacity-90">Albums</span>
        <Select onValueChange={(value: SortKey) => setCurrentSortKey(value)}>
          <SelectTrigger className="ml-2 mt-2 border-1px rounded-sm">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {sortKeys.map((sortKey) => (
              <SelectItem key={sortKey} value={sortKey}>
                {sortKey.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {artist?.albums && (
        <div>
          <AlbumsDisplay
            showArtistName={false}
            showReleasedAt
            albums={artist?.albums}
            sortKey={currentSortKey}
          />
        </div>
      )}
    </div>
  );
}
