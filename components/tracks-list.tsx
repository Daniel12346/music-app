import { addNewQueueIdToTrack, cn } from "@/lib/utils";
import { AudioLinesIcon, ListEndIcon, ListStartIcon } from "lucide-react";
import LikeTrack from "./like-track";
import TrackArtists from "./track-artists";
import { SourceType, TrackWithExtra, useTrackStore } from "@/state/store";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

export default function TracksList({
  tracks,
  sourceName,
  sourceType,
  sourceId,
  tracksToQueue = tracks,
}: {
  tracks: Omit<TrackWithExtra, "queueId">[];
  sourceName?: string;
  sourceType?: SourceType;
  sourceId?: string;
  //the tracks that are queued when the user clicks on a track, they don't have to be the same as the listed tracks
  tracksToQueue?: Omit<TrackWithExtra, "queueId">[];
}) {
  const addTrackToQueue = useTrackStore((state) => state.addTrackToQueue);
  const addTracksToQueue = useTrackStore((state) => state.addTracksToQueue);
  const setQueue = useTrackStore((state) => state.setQueue);
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);
  const currentTrack = useTrackStore((state) => state.currentTrack);
  const queueTracksFromSource = useTrackStore(
    (state) => state.queueTracksFromSource
  );
  const isPlaying = useTrackStore((state) => state.isPlaying);
  return (
    <ul className="w-full max-w-md space-y-2 md:space-y-1 border-t-2 p-2">
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
                const tracksWithQueueIds = tracksToQueue.map((track) =>
                  addNewQueueIdToTrack(track)
                );
                const trackWithQueueId = tracksWithQueueIds[idx];
                setCurrentTrack(
                  trackWithQueueId,
                  sourceId,
                  sourceType,
                  sourceName
                );
                //clearing the queue and adding all the album tracks starting with the selected track
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
