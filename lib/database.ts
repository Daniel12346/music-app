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
export const getAlbumWithTracksAndArtist = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("albums")
    .select("*, tracks(*), artists(*)")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getAlbumsLikedByUser = async (
  client: SupabaseClient<Database>,
  userId?: string,
) => {
  if (!userId) {
    return null;
  }
  const { data, error } = await client
    .from("albums")
    .select("*, users_liked_albums(*)")
    .eq("users_liked_albums.user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const likeAlbum = async (
  client: SupabaseClient<Database>,
  userId: string,
  albumId: string,
) => {
  const { data, error } = await client
    .from("users_liked_albums")
    .insert({ user_id: userId, album_id: albumId });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const unlikeAlbum = async (
  client: SupabaseClient<Database>,
  userId: string,
  albumId: string,
) => {
  const { data, error } = await client
    .from("users_liked_albums")
    .delete()
    .match({ user_id: userId, album_id: albumId });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getAuthUser = async (
  client: SupabaseClient<Database>,
) => {
  const { data, error } = await client.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  return data.user;
};
export const getSessionUser = async (
  client: SupabaseClient<Database>,
) => {
  const session = await client.auth.getSession();
  const { data, error } = session;
  if (error) {
    throw new Error(error.message);
  }
  return data.session?.user;
};
