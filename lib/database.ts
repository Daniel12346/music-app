import { Database } from "@/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getAlbums = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("albums").select("*");

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
export const getAlbum = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("albums")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};
export const getAlbumWithTracks = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("albums")
    .select("*, tracks(*)")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
