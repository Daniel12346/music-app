import LikedAlbumsLimited from "@/components/liked-albums-limited";
import MyPlaylistsLimited from "@/components/my-playlists-limited";
import NewAlbumsLimited from "@/components/new-albums-limited";
import Link from "next/link";

export default function Home() {
  return (
    <div className="px-3 flex flex-col gap-8">
      <div>
        <NewAlbumsLimited />
      </div>
      <div>
        <MyPlaylistsLimited />
      </div>
      <div>
        <LikedAlbumsLimited />
      </div>
    </div>
  );
}
