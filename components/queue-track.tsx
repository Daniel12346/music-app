import { ListIcon, XIcon } from "lucide-react";
import TrackArtists from "./track-artists";
import TrackOptionsButton from "./track-options";
import Image from "next/image";
import { TrackWithExtra, useTrackStore } from "@/state/store";
import { cn } from "@/lib/utils";
export default function QueueTrack({
  track,
  isCurrent = false,
  isQueuedByUser = false,
}: {
  track: TrackWithExtra;
  isCurrent?: boolean;
  isQueuedByUser?: boolean;
}) {
  const {
    removeTrackFromSourceQueue,
    removeTrackFromUserQueue,
    setCurrentTrack,
  } = useTrackStore();
  return (
    <div
      className={cn(
        "flex items-center gap-2 pr-2",
        isCurrent &&
          "border-y-highlight/50 border-y-2 py-1 bg-highlight/5 text-highlight"
      )}
      onClick={(e) => {
        e.stopPropagation();
        setCurrentTrack(track);
      }}
    >
      <Image
        src={track.albumCoverUrl}
        alt={track.title}
        width={64}
        height={64}
        className="w-16 h-16 rounded"
      />
      <div className="flex-1 flex flex-col">
        <span className="text-lg font-semibold">{track.title}</span>
        <TrackArtists artists={track.artists} textColor="text-foreground" />
      </div>
      <div className="flex text-foreground">
        {isQueuedByUser && <ListIcon stroke="var(--color-fuchsia-500)" />}
        <TrackOptionsButton track={track} />
        <XIcon
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            isQueuedByUser
              ? removeTrackFromUserQueue(track.queueId)
              : removeTrackFromSourceQueue(track.queueId);
          }}
        />
      </div>
    </div>
  );
}
