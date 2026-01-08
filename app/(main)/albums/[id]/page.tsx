import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";

import { getAlbumWithTracksAndArtist } from "@/lib/database";
import Album from "./album";

export default async function AlbumsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //setting up SWR with server-side rendering by prefetching the album on the server
  const { id } = await params;
  const supabase = await createClient();
  const album = await getAlbumWithTracksAndArtist(supabase, id);
  return (
    <SWRConfig
      value={{
        //the fetched album data is used as fallback for the query on the client 
        fallback: {
          [unstable_serialize(["getAlbumWithTracksAndArtist", id])]: album,
        },
      }}
    >
      <Album />
    </SWRConfig>
  );
}
