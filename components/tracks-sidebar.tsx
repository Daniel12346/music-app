import { getTracksLikedByUser, getUserHistoryTracks } from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import TracksLiked from "./tracks-liked";
import TracksHistory from "./tracks-history";
import Link from "next/link";

export default async function TracksSidebar() {
  const supabase = await createClient();
  const { data: myData } = await supabase.auth.getUser();
  const myID = myData.user?.id;
  const [myLikedTracks, tracksHistory] = await Promise.all([
    getTracksLikedByUser(supabase, myID),
    getUserHistoryTracks(supabase, myID),
  ]);
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
        {myID ? (
          <>
            <TracksLiked />
            <TracksHistory />
          </>
        ) : (
          <div className="flex justify-center text-lg">
            <div className="text-foreground max-w-xs">
              <Link
                href="/sign-in"
                className="text-fuchsia-500 hover:underline"
              >
                Sign in
              </Link>{" "}
              to like tracks and view listening history
            </div>
          </div>
        )}
      </aside>
    </SWRConfig>
  );
}
