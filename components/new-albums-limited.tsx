"use client";
import { getNewAlbums } from "@/lib/database";
import useSWR from "swr";
import AlbumsDisplay from "./albums-display";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

//only shows a limited number of albums
export default function NewAlbumsLimited({ limit = 4 }: { limit?: number }) {
  const supabase = createClient();
  const { data: newAlbums } = useSWR(["getNewAlbums", limit], () =>
    getNewAlbums(supabase, limit)
  );
  return (
    <div>
      <div className="flex justify-between pr-6">
        <h2 className="mb-2 text-xl font-bold text-foreground/90">
          New albums
        </h2>
        <Link
          href="/albums/new"
          className="hover:underline flex items-end pb-1 text-muted-foreground"
        >
          See all
        </Link>
      </div>
      <AlbumsDisplay albums={newAlbums ?? []} />
    </div>
  );
}
