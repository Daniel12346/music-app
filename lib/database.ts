import { Database } from "@/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export const getAlbums = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("albums").select(
    "*, artists_albums(*, artists(name, id))",
  );
  if (error) {
    throw error;
  }
  return data;
};

export type AlbumsWithArtists = Awaited<ReturnType<typeof getAlbums>>;

export const getAlbum = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("albums")
    .select("*, artists(*), tracks(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};
export const getAlbumWithTracksAndArtist = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("albums")
    .select(
      "*, tracks!albums_tracks(*, tracks_artists(*, artists(id, name))), artists(*)",
    )
    .eq("id", id)
    .single();
  if (error) {
    throw error;
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
    .from("users_liked_albums")
    .select("album_id, albums(*, artists_albums(*, artists(name, id)))")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  return data?.map((record) => record.albums);
};

export const likeAlbum = async (
  client: SupabaseClient<Database>,
  userId: string,
  albumId: string,
) => {
  const { data, error } = await client
    .from("users_liked_albums")
    .insert({ user_id: userId, album_id: albumId })
    .select();
  if (error) {
    throw error;
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
    .match({ user_id: userId, album_id: albumId })
    .select();

  if (error) {
    throw error;
  }
  return data;
};

export const getAuthUser = async (
  client: SupabaseClient<Database>,
) => {
  const { data, error } = await client.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
};
export const getSessionUser = async (
  client: SupabaseClient<Database>,
) => {
  const session = await client.auth.getSession();
  const { data, error } = session;
  if (error) {
    throw error;
  }
  return data.session?.user;
};

export const getArtistWithAlbums = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client.from("artists").select(
    "*, albums(*, artists_albums(*, artists(name, id)))",
  ).eq("id", id).single();
  if (error) {
    throw error;
  }
  return data;
};

export const likeTrack = async (
  client: SupabaseClient<Database>,
  userId: string,
  trackId: string,
  trackAlbumId: string,
) => {
  const { data, error } = await client
    .from("users_liked_tracks")
    .insert({
      user_id: userId,
      track_id: trackId,
      track_album_id: trackAlbumId,
    })
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const unlikeTrack = async (
  client: SupabaseClient<Database>,
  userId: string,
  trackId: string,
  trackAlbumId: string,
) => {
  const { data, error } = await client
    .from("users_liked_tracks")
    .delete()
    .match({ user_id: userId, track_id: trackId, track_album_id: trackAlbumId })
    .select();

  if (error) {
    throw error;
  }
  return data;
};

export const getTracksLikedByUser = async (
  client: SupabaseClient<Database>,
  userId?: string,
) => {
  if (!userId) {
    return null;
  }
  const { data, error } = await client
    .from("users_liked_tracks")
    .select("track_id, track_album_id, tracks(*), albums(*)")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  const trackData = data?.map((record) => ({
    ...record.tracks,
    album: record.albums,
  }));
  return trackData;
};

export const getUserHistoryTracks = async (
  client: SupabaseClient<Database>,
  userId?: string,
) => {
  if (!userId) {
    return null;
  }
  const { data, error } = await client
    .from("users_history_tracks")
    .select(
      "track_id, played_at, tracks(*, tracks_artists(*, artists(id, name))), albums(*)",
    )
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  const trackData = data?.map((record) => ({
    ...record.tracks,
    album: record.albums,
    last_played_at: record.played_at,
    artists: record.tracks.tracks_artists.map(
      ({ artists }) => artists,
    ),
  }));
  return trackData;
};

export const addTrackToHistory = async (
  client: SupabaseClient<Database>,
  userId: string,
  trackId: string,
  trackAlbumId: string,
) => {
  const { data, error } = await client
    .from("users_history_tracks")
    .upsert({
      user_id: userId,
      track_id: trackId,
      track_album_id: trackAlbumId,
    })
    .select();

  if (error) {
    if (error.code === "23505") {
      // This error code indicates a unique constraint violation, which means the track already exists in history.
      // There's a trigger that updates the played_at timestamp, so we can return the existing data.
      return data;
    }
    // For other errors, throw an error to be handled by the caller.
    throw error;
  }
  return data;
};

export const getUserPlaylists = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client
    .from("playlists")
    .select()
    .eq("owner_id", userId);
  if (error) {
    throw error;
  }
  return data;
};

export const getUserPlaylistsWithPreview = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client
    .from("playlists")
    .select(
      "*, playlists_tracks(*, albums(id, title, cover_url), tracks(*, tracks_artists(*, artists(name, id))))",
    )
    .eq("owner_id", userId)
    .limit(10, { referencedTable: "playlists_tracks" })
    .order("added_at", {
      referencedTable: "playlists_tracks",
      ascending: false,
    });
  if (error) {
    throw error;
  }
  const playlists = data?.map((playlist) => ({
    ...playlist,
    // tracks: playlist.playlists_tracks.map((playlistTrack) => ({
    //   ...playlistTrack.tracks,
    //   album: playlistTrack.tracks.albums,
    //   artists: playlistTrack.tracks.tracks_artists.map((artist) =>
    //     artist.artists
    //   ),
    // })),
  }));
  return playlists;
};

export type PlaylistsWithPreview = Awaited<
  ReturnType<typeof getUserPlaylistsWithPreview>
>;

export const getPlaylist = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("playlists")
    .select(
      "*, owner:profiles!playlists_owner_id_fkey(id, username), playlists_tracks(*, contributor:profiles(id, username), albums(id, title, cover_url), tracks(*, tracks_artists(*, artists(name, id))))",
    )
    .eq("id", id)
    .order("added_at", {
      referencedTable: "playlists_tracks",
      ascending: false,
    })
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
};

export const likePlaylist = async (
  client: SupabaseClient<Database>,
  userId: string,
  playlistId: string,
) => {
  const { data, error } = await client
    .from("users_liked_playlists")
    .insert({ playlist_id: playlistId, user_id: userId })
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const unlikePlaylist = async (
  client: SupabaseClient<Database>,
  userId: string,
  playlistId: string,
) => {
  const { data, error } = await client
    .from("users_liked_playlists")
    .delete()
    .match({ playlist_id: playlistId, user_id: userId })
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const getPlaylistsLikedByUser = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client
    .from("users_liked_playlists")
    .select("playlist_id, playlists(*)")
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  return data;
};
export const addTrackToPlaylist = async (
  client: SupabaseClient<Database>,
  playlistId: string,
  trackId: string,
  trackAlbumId: string,
  userId: string,
) => {
  const { data, error } = await client
    .from("playlists_tracks")
    .insert({
      playlist_id: playlistId,
      track_id: trackId,
      track_album_id: trackAlbumId,
      added_by: userId,
    })
    .select();
  if (error) {
    throw error;
  }
  return data;
};

export const removeTrackFromPlaylist = async (
  client: SupabaseClient<Database>,
  playlistId: string,
  trackId: string,
  trackAlbumId: string,
) => {
  const { data, error } = await client
    .from("playlists_tracks")
    .delete()
    .match({
      playlist_id: playlistId,
      track_id: trackId,
      track_album_id: trackAlbumId,
    })
    .select();
  if (error) {
    throw error;
  }
  return data;
};
