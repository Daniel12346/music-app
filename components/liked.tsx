import { getTracksLikedByUser } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import TracksLiked from "./tracks-liked";

export default async function Liked() {
  const supabase = await createClient();
  const { data: myData } = await supabase.auth.getUser();
  const myID = myData.user?.id;
  const myLikedTracks = await getTracksLikedByUser(supabase, myID);
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getTracksLikedByUser", myID])]: myLikedTracks,
        },
      }}
    >
      <TracksLiked />
    </SWRConfig>
  );
}
