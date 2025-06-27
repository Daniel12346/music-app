import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  ChevronRightIcon,
  Disc2Icon,
  Download,
  EllipsisVerticalIcon,
  ListEndIcon,
  ListMusicIcon,
  ListStartIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { TrackWithExtra, useTrackStore } from "@/state/store";
import Link from "next/link";
import LikeTrack from "./like-track";
import { getUserPlaylistsWithPreview } from "@/lib/database";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { addNewQueueIdToTrack } from "@/lib/utils";

export default function TrackOptionsButton({
  track,
}: {
  track: Omit<TrackWithExtra, "queueId">;
}) {
  const supabase = createClient();
  const { data } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;
  const { data: myPlaylists } = useSWR(
    myID ? ["getUserPlaylistsWithPreview", myID] : null,
    () => getUserPlaylistsWithPreview(supabase, myID!)
  );
  const addTrackToQueue = useTrackStore((state) => state.addTrackToQueue);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/* TODO: @md:hidden */}
        <EllipsisVerticalIcon className="cursor-pointer block " />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem className="flex justify-between">
          {track.artists.length === 1 ? (
            <>
              <UserIcon size={20} />
              <Link href={`/artists/${track.artists[0].id}`}>View artist</Link>
            </>
          ) : (
            <>
              <UsersIcon size={20} />
              <div className="flex">
                View artist{" "}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ChevronRightIcon size={20} className="-mr-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {track.artists.map((artist) => (
                      <DropdownMenuItem key={artist.id}>
                        <Link href={`/artists/${artist.id}`}>
                          {artist.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/albums/${track.albumId}`}
            className="w-full flex justify-between"
          >
            <Disc2Icon size={20} />
            <span>View album</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          {/* TODO: enable liking by clicking anywhere, not just the icon */}
          <LikeTrack
            trackID={track.id}
            trackAlbumID={track.albumId}
            size={20}
          />
          <span>Like</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          <ListMusicIcon size={20} />
          <div className="flex">
            Add to playlist{" "}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ChevronRightIcon size={20} className="-mr-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* TODO: playlists */}
                {myPlaylists?.map((playlist) => (
                  <DropdownMenuItem key={playlist.id}>
                    <Link href={`/playlists/${playlist.id}`}>
                      {playlist.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          <Download />
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex justify-between"
          onClick={(e) => {
            e.stopPropagation();
            addTrackToQueue(addNewQueueIdToTrack(track), "start");
          }}
        >
          <ListStartIcon size={20} />
          <span>Add to queue start</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between "
          onClick={(e) => {
            e.stopPropagation();
            addTrackToQueue(addNewQueueIdToTrack(track), "end");
          }}
        >
          <ListEndIcon size={20} />
          <span>Add to queue end</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
