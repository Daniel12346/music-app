import { createClient } from "@/utils/supabase/server";
import { SWRConfig } from "swr";
import { getAlbums } from "../../../lib/database";
import Albums from "./albums";

export default async function AlbumsPage() {
  const supabase = await createClient();
  const albums = await getAlbums(supabase);
  return (
    <SWRConfig
      value={{
        fallback: {
          albums: albums,
        },
      }}
    >
      <Albums />
    </SWRConfig>
  );
}
