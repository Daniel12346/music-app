import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";

import { getAlbumWithTracksAndArtist } from "@/lib/database";
import Album from "./album";

export default async function AlbumsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const album = await getAlbumWithTracksAndArtist(supabase, id);
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getAlbumWithTracksAndArtist", id])]: album,
        },
      }}
    >
      <Album />
    </SWRConfig>
  );
}
