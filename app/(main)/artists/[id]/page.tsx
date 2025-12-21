import {
  getAllArtistTracks,
  getArtistWithAlbumsAndTopTracks,
} from "@/lib/database";
import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import Artist from "./artist";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function ArtistPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const artist = await getArtistWithAlbumsAndTopTracks(supabase, id);

  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getArtistWithAlbumsAndTopTracks", id])]: artist,
          //getAllArtistTracks is not prefetched because all tracks are not needed on the server side
          //all tracks are needed only on the client when user clicks on one of the top tracks and all tracks are queued
          [unstable_serialize(["getAllArtistTracks", id])]: [],
        },
      }}
    >
      <Artist />
    </SWRConfig>
  );
}
