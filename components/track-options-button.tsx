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
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { TrackWithExtra } from "@/state/store";
import Link from "next/link";
import LikeTrack from "./like-track";

export default function TrackOptionsButton({
  track,
}: {
  track: Omit<TrackWithExtra, "queueId">;
}) {
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
              <Link href={`/artists/${track.artists[0].id}`} className="flex">
                View artist{" "}
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ChevronRightIcon size={20} />
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
              </Link>
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
          <Download />
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between">
          <ListStartIcon size={20} />
          <span>Add to queue start</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between">
          <ListEndIcon size={20} />
          <span>Add to queue end</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
