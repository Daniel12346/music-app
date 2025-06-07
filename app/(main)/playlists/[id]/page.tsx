import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import { getPlaylist } from "@/lib/database";
import Playlist from "./playlist";

interface Props {
  params: { id: string };
}
export default async function PlaylistPage({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;
  const playlist = await getPlaylist(supabase, id).catch((err) => {
    console.log(err);
  });
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getPlaylist", id])]: playlist,
        },
      }}
    >
      <Playlist />
    </SWRConfig>
  );
}
