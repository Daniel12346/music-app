import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import {
  getAlbumsLikedByUser,
  getNewAlbums,
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
            }
            //getNewAlbums is prefetched even if user is not logged in because it doesn't use myID
          : {
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
