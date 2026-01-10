import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import {
  getAlbumsLikedByUser,
  getNewAlbums,
  getNewTracksByLikedArtists,
  getUserPlaylistsWithPreview,
} from "@/lib/database";
import Home from "./home";

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
              [unstable_serialize(["getAlbumsLikedByUser", myID, 4])]:
                getAlbumsLikedByUser(supabase, myID!, 4),
              [unstable_serialize(["getUserPlaylistsWithPreview", myID, 4])]:
                getUserPlaylistsWithPreview(supabase, myID!, 4),
              [unstable_serialize(["getNewAlbums", 4])]: getNewAlbums(
                supabase,
                4
              ),
              //getNewTracksByLikedArtists is used in the new tracks playlist in my playlists on the home page
              [unstable_serialize(["getNewTracksByLikedArtists", myID])]:
                getNewTracksByLikedArtists(supabase, myID!),
            }
          : //getNewAlbums is prefetched even if user is not logged in because it doesn't use myID
            {
              [unstable_serialize(["getNewAlbums", 4])]: getNewAlbums(
                supabase,
                4
              ),
            },
      }}
    >
      <Home />
    </SWRConfig>
  );
}
