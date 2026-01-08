import LikedAlbums from "@/components/liked-albums";
import MyPlaylists from "@/components/my-playlists";
import NewAlbums from "@/components/new-albums";
import Link from "next/link";

export default function Home() {
  return (
    <div className="px-3 flex flex-col gap-8">
      <div>
        <div className="flex justify-between pr-6">
          <h2 className="mb-2 text-xl font-bold text-foreground/90">
            New albums
          </h2>
          <Link
            href="/albums/new"
            className="hover:underline flex items-end pb-1 text-muted-foreground"
          >
            See all
          </Link>
        </div>
        <NewAlbums />
      </div>
      <div>
        <div className="flex justify-between pr-6">
          <h2 className="mb-2 text-xl font-bold text-foreground/90">
            Your playlists
          </h2>
          <Link
            href="/playlists/me"
            className="hover:underline flex items-end pb-1 text-muted-foreground"
          >
            See all
          </Link>
        </div>
        <MyPlaylists />
      </div>
      <div>
        <div className="flex justify-between pr-6">
          <h2 className="mb-2 text-xl font-bold text-foreground/90">
            Liked albums
          </h2>
          <Link
            href="/albums/liked"
            className="hover:underline flex items-end pb-1 text-muted-foreground"
          >
            See all
          </Link>
        </div>
        <LikedAlbums />
      </div>
    </div>
  );
}
