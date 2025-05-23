"use client";
import AlbumsDisplay from "@/components/albums-display";
import { getArtistWithAlbums } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function Artist() {
  const client = createClient();
  const { id } = useParams<{ id: string }>();
  const { data: artist } = useSWR(["getArtistWithAlbums", id], () =>
    getArtistWithAlbums(client, id)
  );
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
      {artist?.albums && (
        <AlbumsDisplay
          showArtistName={false}
          showReleasedAt
          albums={artist?.albums}
        />
      )}
    </div>
  );
}
