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
  ListStartIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { TrackWithExtra, useTrackStore } from "@/state/store";
import Link from "next/link";
import LikeTrack from "./like-track";
import {
  addTrackToPlaylist,
  getPlaylistsSearchResults,
  getUserPlaylistsWithPreview,
} from "@/lib/database";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { addNewQueueIdToTrack } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";

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
  const [playlistsSearchQuery, setPlaylistsSearchQuery] = useState("");
  const { data: playlistsSearchResult } = useSWR(
    myID ? ["getPlaylistSearchResults", myID, playlistsSearchQuery] : null,
    () => getPlaylistsSearchResults(supabase, myID!, playlistsSearchQuery)
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Tooltip>
          <TooltipContent>More options</TooltipContent>
          <TooltipTrigger asChild>
            <EllipsisVerticalIcon className="cursor-pointer block " />
          </TooltipTrigger>
        </Tooltip>
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
          <LikeTrack
            trackID={track.id}
            trackAlbumID={track.albumId}
            size={20}
          />
          <span>Like</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          <PlusIcon size={20} />
          <div className="flex">
            Add to playlist{" "}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ChevronRightIcon size={20} className="-mr-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {myPlaylists?.map((playlist) => (
                  <DropdownMenuItem
                    key={playlist.id}
                    onClick={async (e) => {
                      try {
                        //TODO: handle error, optimistically update state with data
                        const data = await addTrackToPlaylist(
                          supabase,
                          playlist.id,
                          track.id,
                          track.albumId,
                          myID!
                        );
                      } catch (e) {
                        throw e;
                      }
                    }}
                  >
                    {playlist.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="relative">
                  <Input
                    placeholder="search playlists"
                    value={playlistsSearchQuery}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      setPlaylistsSearchQuery(e.target.value);
                    }}
                  />
                  <SearchIcon
                    size={20}
                    className="absolute right-3 stroke-foreground"
                  />
                </DropdownMenuItem>
                {playlistsSearchResult?.map((playlist) => (
                  <DropdownMenuItem
                    className="pl-2"
                    key={playlist.id}
                    onClick={async (e) => {
                      try {
                        const data = await addTrackToPlaylist(
                          supabase,
                          playlist.id || "",
                          track.id,
                          track.albumId,
                          myID!
                        );
                      } catch (e) {
                        throw e;
                      }
                    }}
                  >
                    {playlist.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between"
          onClick={async (e) => {
            e.stopPropagation();
            const { url, title } = track;
            //get part of url after "tracks//""
            const id = url.split("tracks//")[1];
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("tracks")
              .getPublicUrl(id, { download: true });
            const link = document.createElement("a");
            link.setAttribute("download", title);
            link.href = publicUrl;
            document.body.appendChild(link);
            link.click();
            link.remove();
          }}
        >
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
          <span>Add to start of queue</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex justify-between "
          onClick={(e) => {
            e.stopPropagation();
            addTrackToQueue(addNewQueueIdToTrack(track), "end");
          }}
        >
          <ListEndIcon size={20} />
          <span>Add to end of queue</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
