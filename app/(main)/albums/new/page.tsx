import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import { getNewAlbums } from "@/lib/database";
import AllNewAlbums from "./new-albums";

export default async function NewAlbumsPage() {
  const supabase = await createClient();
  const newAlbums = await getNewAlbums(supabase, Infinity);
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getNewAlbums", Infinity])]: newAlbums,
        },
      }}
    >
      <AllNewAlbums />
    </SWRConfig>
  );
}
