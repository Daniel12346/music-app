import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Disc2Icon,
  Download,
  EllipsisVerticalIcon,
  ListEndIcon,
  ListStartIcon,
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
        <EllipsisVerticalIcon className="cursor-pointer block @md:hidden" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuItem className="flex flex-between">
          {/* <Link href={`/artists/${track.artists.id}`}>View artist</Link> */}
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
