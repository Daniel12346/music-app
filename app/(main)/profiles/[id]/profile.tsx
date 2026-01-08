"use client";
import { getUserProfile } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";

export default function Profile() {
  const supabase = createClient();
  const { id } = useParams<{ id: string }>();
  const {
    data: myProfileData,
  } = useSWR(id ? ["getUserProfile", id] : null, () =>
    getUserProfile(supabase, id)
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center">
        <div className="relative group">
         
          <img
            src={myProfileData?.avatar_url || undefined}
            width={50}
            height={50}
            className="w-40 h-40 rounded-full object-cover object-top"
          />
        </div>
        <h1 className="text-xl ">{myProfileData?.username}</h1>
      </div>
    </div>
  );
}
