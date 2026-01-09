"use client";
import AlbumsDisplay from "@/components/albums-display";
import { getNewAlbums } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function NewAlbums() {
  const supabase = createClient();
  const { data: newAlbums } = useSWR(["getNewAlbums", Infinity], () =>
    getNewAlbums(supabase)
  );
  return <AlbumsDisplay albums={newAlbums ?? []} />;
}
