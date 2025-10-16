import { getArtistWithAlbums } from "@/lib/database";
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
  const artist = await getArtistWithAlbums(supabase, id);

  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getArtistWithAlbums", id])]: artist,
        },
      }}
    >
      <Artist />
    </SWRConfig>
  );
}
