import LikedAlbumsLimited from "@/components/liked-albums-limited";
import MyPlaylistsLimited from "@/components/my-playlists-limited";
import NewAlbumsLimited from "@/components/new-albums-limited";
import {
  MY_PLAYLISTS_PREVIEW_LIMIT,
  NEW_ALBUMS_PREVIEW_LIMIT,
} from "../constants";

export default function Home() {
  return (
    <div className="px-3 flex flex-col gap-8">
      <div>
        <NewAlbumsLimited limit={NEW_ALBUMS_PREVIEW_LIMIT} />
      </div>
      <div>
        <MyPlaylistsLimited limit={MY_PLAYLISTS_PREVIEW_LIMIT} />
      </div>
      <div>
        <LikedAlbumsLimited limit={MY_PLAYLISTS_PREVIEW_LIMIT} />
      </div>
    </div>
  );
}
