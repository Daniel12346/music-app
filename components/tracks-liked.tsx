"use client";
import { getTracksLikedByUser } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

export default function TracksLiked() {
  const supabase = createClient();
  const { data } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;

  const {
    data: myLikedTracks,
    error,
    isLoading,
  } = useSWR(myID ? ["getTracksLikedByUser", myID] : null, () =>
    getTracksLikedByUser(supabase, myID)
  );

  return (
    <div>
      <ul className="flex flex-col gap-1.5">
        {myLikedTracks?.map((track) => (
          <li key={track.id} className="flex">
            <img src={track.album.cover_url!} width={20} alt={track.title} />
            <span>{track.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
