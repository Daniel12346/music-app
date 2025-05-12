import { createClient } from "@/utils/supabase/server";
import { SWRConfig } from "swr";
import Me from "./me";
import { getAlbumsLikedByUser } from "@/lib/database";

export default async function MePage() {
  const supabase = await createClient();
  const { data: meData } = await supabase.auth.getUser();
  const myID = meData.user?.id;
  const myLikedAlbums = await getAlbumsLikedByUser(supabase, myID);

  return (
    <SWRConfig value={{ fallback: { myLikedAlbums } }}>
      <Me />
    </SWRConfig>
  );
}
