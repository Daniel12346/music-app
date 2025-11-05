import { getUserProfile } from "@/lib/database";
import { SWRConfig, unstable_serialize } from "swr";
import Profile from "./profile";
import { createClient } from "@/utils/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const profile = await getUserProfile(supabase, id);
  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize(["getUserProfile", id])]: profile,
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
}
