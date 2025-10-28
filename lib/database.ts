import { Database } from "@/database.types";
import { createBrowserClient } from "@supabase/ssr";
import { QueryData, SupabaseClient } from "@supabase/supabase-js";
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export const getAlbums = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from("albums").select(
    "*, artists(name, id)",
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
      "*, tracks!albums_tracks(*, tracks_artists(artists(id, name))), artists(*)",
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
    .select("album_id, albums(*, artists(name, id))")
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
    "*, albums(*,artists(name, id))",
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
    .select(
      "track_id, track:tracks(*, artists(id, name)), track_album:albums(*)",
    )
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  return data;
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
      "track_id, played_at, track:tracks(*, artists(id, name)), track_album:albums(*)",
    )
    .eq("user_id", userId);

  if (error) {
    throw error;
  }
  return data;
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
      "*, playlists_tracks(added_at, added_by, track_album:albums(id, title, cover_url)), owner:profiles!playlists_owner_id_fkey(id, username, avatar_url)",
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
  return data;
};

export type PlaylistsWithPreview = Awaited<
  ReturnType<typeof getUserPlaylistsWithPreview>
>;

export type PlaylistWithPreview = PlaylistsWithPreview[number];
export const getPlaylist = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("playlists")
    .select(
      "*, owner:profiles!playlists_owner_id_fkey(id, username, avatar_url), playlists_tracks(*, contributor:profiles(id, username), albums(id, title, cover_url), tracks(*, tracks_artists(artists(name, id))))",
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

export const getNewAlbumsByLikedArtists = async (
  client: SupabaseClient<Database>,
  userId: string,
): Promise<AlbumsWithArtists> => {
  const { data, error } = await client
    .from("users_liked_artists")
    .select(
      "artist_id, artists(*, albums(*, artists(name, id)))",
    )
    //album released in last 5 years
    //TODO: change to last week/month
    .gte(
      "artists.albums.released_at",
      new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toDateString(),
    )
    .eq("user_id", userId);
  if (error) {
    throw error;
  }
  const artists = data.map((record) => record.artists);
  const albums = artists.map((artist) => artist.albums).flat();
  return albums;
};

// export  const makePlaylistFromTracks= async (

// )
export const getNewTracksByLikedArtists = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client
    //tracks_by_liked_artists is an sql view
    .from("tracks_by_liked_artists")
    .select(
      "*, tracks_artists(artists(name, id))",
    )
    //album released in last 5 years
    .gte(
      "album_released_at",
      new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toDateString(),
    )
    .eq("liked_by_user_id", userId);
  return data;
};
export type NewTracksByLikedArtists = Awaited<
  ReturnType<typeof getNewTracksByLikedArtists>
>;

export const makeNewTracksPlaylist = (
  tracks: NewTracksByLikedArtists,
) => {
  if (!tracks) return null;
  return {
    id: "new_releases",
    name: "New Tracks",
    image_url: "/new.png",
    description: "Recent tracks by artists you like",
    owner_id: null,
    owner: {
      id: "",
      username: null,
      avatar_url: null,
    },
    status: "PRIVATE" as const,
    created_at: new Date().toISOString(),
    playlists_tracks: tracks.map((track) => ({
      added_at: null,
      added_by: null,
      track: {
        play_count: track.play_count!,
        length: track.length,
        id: track.id!,
        title: track.title!,
        url: track.url!,
        created_at: "",
        tracks_artists: track.tracks_artists,
      },
      track_album: {
        id: track.album_id!,
        title: track.album_title!,
        cover_url: track.album_cover_url!,
      },
    })),
  };
};

export const incrementTrackPlayCount = async (
  client: SupabaseClient<Database>,
  trackId: string,
) => {
  const { data, error } = await client.rpc("increment_track_play_count", {
    track_id: trackId,
  });
  if (error) {
    throw error;
  }
  return data;
};

export const getSearchResults = async (
  client: SupabaseClient<Database>,
  query: string,
) => {
  if (!query) return null;
  if (!query.trim()) return null;
  //TODO: add limits to queries
  const [albumsRes, tracksRes, artistsRes, playlistsRes] = await Promise
    .allSettled([
      client.from("albums").select("*, artists(name, id)").ilike(
        "title",
        `%${query}%`,
      ),
      client.from("tracks").select(
        "*, tracks_artists(artists(name, id)), albums_tracks(albums(title, id, cover_url))",
      )
        .ilike(
          "title",
          `%${query}%`,
        ),
      client.from("artists").select("*, albums(title, id)").ilike(
        "name",
        `%${query}%`,
      ),
      //TODO: custom rpc to limit track albums (only 4 oldest albums with distinct covers needed)
      client.from("playlists").select(
        "*, playlists_tracks(added_at, added_by, track_album:albums(id, title, cover_url)), owner:profiles!playlists_owner_id_fkey(id, username, avatar_url)",
      ).ilike("name", `%${query}%`),
    ]);
  return {
    albums: albumsRes.status === "fulfilled" ? albumsRes.value : null,
    tracks: tracksRes.status === "fulfilled" ? tracksRes.value : null,
    artists: artistsRes.status === "fulfilled" ? artistsRes.value : null,
    playlists: playlistsRes.status === "fulfilled" ? playlistsRes.value : null,
  };
};

export const getPlaylistsSearchResults = async (
  client: SupabaseClient<Database>,
  userId: string,
  query: string,
) => {
  if (!query) return null;
  if (!query.trim()) return null;
  const { data, error } = await client
    .from("playlists_with_sharing")
    .select(
      "*, playlists_tracks(added_at, added_by, track_album:albums(id, title, cover_url))",
    )
    .like("name", `%${query}%`)
    .or(
      `owner_id.eq.${userId}, shared_with_user_id.eq.${userId}`,
    );

  if (error) {
    throw error;
  }
  return data;
};
export const getProfile = async (
  client: SupabaseClient<Database>,
  userId: string,
) => {
  const { data, error } = await client.from("profiles").select().eq(
    "id",
    userId,
  ).single();
  if (error) {
    throw error;
  }
  return data;
};

//TODO?: remove joining tables
const tracksQuery = supabase.from("tracks").select(
  "*, tracks_artists(artists(name, id)), albums_tracks(albums(title, id, cover_url))",
);
export type TracksWithAlbumsAndArtists = QueryData<typeof tracksQuery>;
