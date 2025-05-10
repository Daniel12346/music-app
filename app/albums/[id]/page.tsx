import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";

import { getAlbum, getAlbums, getAlbumWithTracks } from "@/app/features";
import Album from "./album";

export default async function AlbumsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const supabase = await createClient();
  const album = await getAlbumWithTracks(supabase, id);
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["albumWithTracks", id])]: album,
        },
      }}
    >
      <Album id={id} />
    </SWRConfig>
  );
}
