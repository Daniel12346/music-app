import { createClient } from "@/utils/supabase/server";
import { SWRConfig, unstable_serialize } from "swr";
import { getAlbumsLikedByUser } from "@/lib/database";
import Home from "./home";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: meData } = await supabase.auth.getUser();
  const myID = meData.user?.id;
  const myLikedAlbums = await getAlbumsLikedByUser(supabase, myID);

  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getAlbumsLikedByUser", myID])]: myLikedAlbums,
        },
      }}
    >
      <Home />
    </SWRConfig>
  );
}
