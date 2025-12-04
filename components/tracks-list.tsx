import { addNewQueueIdToTrack, cn } from "@/lib/utils";
import { AudioLinesIcon, ListEndIcon, ListStartIcon } from "lucide-react";
import LikeTrack from "./like-track";
import TrackArtists from "./track-artists";
import { SourceType, TrackWithExtra, useTrackStore } from "@/state/store";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import Link from "next/link";

export default function TracksList({
  tracks,
  sourceName,
  sourceType,
  sourceId,
  //if tracksToQueue are not provided, they are the same as the listed tracks
  tracksToQueue = tracks,
  withBorder = false,
}: {
  tracks: Omit<
    TrackWithExtra & {
      //contributor is only needed for the displayed tracks
      contributor?: {
        id: string;
        username: string | null;
        avatar_url: string | null;
      } | null;
    },
    "queueId"
  >[];
  sourceName?: string;
  sourceType?: SourceType;
  sourceId?: string;
  withBorder?: boolean;
  //tracksToQueue are the tracks that are queued when the user clicks on a displayed track, they don't have to be the same as the displayed tracks
  tracksToQueue?: Omit<TrackWithExtra, "queueId">[];
}) {
  const addTrackToQueue = useTrackStore((state) => state.addTrackToQueue);
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);
  const currentTrack = useTrackStore((state) => state.currentTrack);
  const queueTracksFromSource = useTrackStore(
    (state) => state.queueTracksFromSource
  );
  const isPlaying = useTrackStore((state) => state.isPlaying);
  return (
    <ul
      className={cn(
        "w-full max-w-lg space-y-2 md:space-y-1 p-2",
        withBorder && "border-t-2"
      )}
    >
      {tracks?.map((track, idx) => (
        <li
          key={track.id}
          className="w-full  flex items-center justify-between px-2"
        >
          <div className="flex flex-col">
            <span
              className={cn(
                "text-lg font-light cursor-pointer",
                track.id === currentTrack?.id && "text-highlight font-normal"
              )}
              onClick={() => {
                //adding queueIds to all the tracks that are going to be queued
                const tracksWithQueueIds = tracksToQueue.map((track) =>
                  addNewQueueIdToTrack(track)
                );
                const newCurrentTrack =
                  tracksWithQueueIds.find(
                    (track) => track.id === tracks[idx].id
                  ) ?? null;
                setCurrentTrack(
                  newCurrentTrack,
                  sourceId,
                  sourceType,
                  sourceName
                );
                //clearing the queue and adding all the tracks starting with the selected track
                queueTracksFromSource(tracksWithQueueIds);
              }}
            >
              {track.title}
            </span>
            <TrackArtists artists={track.artists} />
          </div>
          <div className="flex items-center gap-2">
            {track.id === currentTrack?.id && (
              <AudioLinesIcon
                size={30}
                className={cn(
                  "animate-spin-x",
                  isPlaying
                    ? "[animation-play-state:running]"
                    : "[animation-play-state:paused]"
                )}
                stroke="var(--highlight)"
              />
            )}
            <span className="text-md font-thin hidden md:block mr-1 text-md">
              {track.play_count} plays
            </span>
            {track.contributor && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/profiles/${track.contributor.id}`}>
                    <img
                      src={track.contributor.avatar_url ?? ""}
                      width={10}
                      height={10}
                      className="w-5 h-5 rounded-full"
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  Added by {track.contributor.username}
                </TooltipContent>
              </Tooltip>
            )}
            <span className="text-md font-extralight">
              {track.length as string}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <ListStartIcon
                  size={16}
                  className="opacity-80 cursor-pointer"
                  onClick={(e) => {
                    //stopping propagation because the on click handle for the li element would set the clicked track as current and add unintened tracks to queue
                    e.stopPropagation();
                    addTrackToQueue(addNewQueueIdToTrack(track), "start");
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Add to start of queue</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ListEndIcon
                  size={16}
                  className="opacity-80 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    addTrackToQueue(addNewQueueIdToTrack(track), "end");
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>Add to end of queue</TooltipContent>
            </Tooltip>
            <LikeTrack trackID={track.id} trackAlbumID={track.albumId} />
          </div>
        </li>
      ))}
    </ul>
  );
}
