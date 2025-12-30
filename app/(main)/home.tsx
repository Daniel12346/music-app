"use client";
import LikedAlbums from "@/components/liked-albums";
import MyPlaylists from "@/components/my-playlists";

export default function Home() {
  return (
    <div className="px-3">
      <div className="mb-4">
        <MyPlaylists />
      </div>
      <div>
        <LikedAlbums />
      </div>
    </div>
  );
}
