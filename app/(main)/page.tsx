import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import {
  getAlbumsLikedByUser,
  getNewAlbums,
  getNewTracksByLikedArtists,
  getUserPlaylistsWithPreview,
} from "@/lib/database";
import Home from "./home";
import {
  LIKED_ALBUMS_PREVIEW_LIMIT,
  MY_PLAYLISTS_PREVIEW_LIMIT,
  NEW_ALBUMS_PREVIEW_LIMIT,
} from "../constants";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: myData } = await supabase.auth.getUser();
  const myID = myData.user?.id;
  return (
    <SWRConfig
      value={{
        //prefetching data if user is logged in
        //all the promises passed to fetch fallback data resolve in parallel
        fallback: myID
          ? {
              ["me"]: myData,
              [unstable_serialize([
                "getAlbumsLikedByUser",
                myID,
                LIKED_ALBUMS_PREVIEW_LIMIT,
              ])]: getAlbumsLikedByUser(
                supabase,
                myID!,
                LIKED_ALBUMS_PREVIEW_LIMIT
              ),
              [unstable_serialize([
                "getUserPlaylistsWithPreview",
                myID,
                MY_PLAYLISTS_PREVIEW_LIMIT,
              ])]: getUserPlaylistsWithPreview(
                supabase,
                myID!,
                MY_PLAYLISTS_PREVIEW_LIMIT
              ),
              [unstable_serialize(["getNewAlbums", NEW_ALBUMS_PREVIEW_LIMIT])]:
                getNewAlbums(supabase, NEW_ALBUMS_PREVIEW_LIMIT),
              //getNewTracksByLikedArtists is used in the new tracks playlist in my playlists on the home page
              [unstable_serialize(["getNewTracksByLikedArtists", myID])]:
                getNewTracksByLikedArtists(supabase, myID!),
            }
          : //getNewAlbums is prefetched even if user is not logged in because it doesn't use myID
            {
              [unstable_serialize(["getNewAlbums", NEW_ALBUMS_PREVIEW_LIMIT])]:
                getNewAlbums(supabase, NEW_ALBUMS_PREVIEW_LIMIT),
            },
      }}
    >
      <Home />
    </SWRConfig>
  );
}
