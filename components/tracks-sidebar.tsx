import { getTracksLikedByUser, getUserHistoryTracks } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import TracksLiked from "./tracks-liked";
import TracksHistory from "./tracks-history";

export default async function TracksSidebar() {
  const supabase = await createClient();
  const { data: myData } = await supabase.auth.getUser();
  const myID = myData.user?.id;
  const myLikedTracks = await getTracksLikedByUser(supabase, myID);
  const tracksHistory = await getUserHistoryTracks(supabase, myID);
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getTracksLikedByUser", myID])]: myLikedTracks,
          [unstable_serialize(["getUserHistoryTracks", myID])]: tracksHistory,
        },
      }}
    >
      <aside className="flex flex-col gap-2 p-2">
        <TracksLiked />
        <TracksHistory />
      </aside>
    </SWRConfig>
  );
}
