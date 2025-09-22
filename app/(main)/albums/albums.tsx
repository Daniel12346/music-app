"use client";
import useSWR from "swr";
import { getAlbums } from "../../../lib/database";
import { createClient } from "@/utils/supabase/client";
import AlbumsDisplay from "@/components/albums-display";

export default function Albums() {
  const supabase = createClient();
  const { data, error, isLoading } = useSWR("getAlbums", () =>
    getAlbums(supabase)
  );
  if (error) {
    return <div>Error loading albums</div>;
  }
  if (!data) {
    return <div>Loading...</div>;
  }
  if (!isLoading && data.length === 0) {
    return <div>No albums found</div>;
  }
  return <AlbumsDisplay albums={data} />;
}
