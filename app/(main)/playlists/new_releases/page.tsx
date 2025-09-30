import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import { getNewTracksByLikedArtists } from "@/lib/database";
import NewReleasesPlaylist from "./newReleasesPlaylist";

export default async function NewReleasesPlaylistPage() {
  const supabase = await createClient();
  const { data: meData } = await supabase.auth.getUser();
  const myID = meData.user?.id;
  const newTracksByLikedArtists = await getNewTracksByLikedArtists(
    supabase,
    myID!
  );
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getNewTracksByLikedArtists", myID])]:
            newTracksByLikedArtists,
        },
      }}
    >
      <NewReleasesPlaylist />
    </SWRConfig>
  );
}
