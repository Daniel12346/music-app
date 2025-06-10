"use client";
import { cn } from "@/lib/utils";
import { useTrackStore } from "@/state/store";
import { XIcon } from "lucide-react";
import TrackArtists from "./track-artists";
import TrackOptionsButton from "./track-options";

export default function Queue() {
  const { queue, removeTrackFromQueue, currentTrack, setCurrentTrack } =
    useTrackStore();
  const idxOfCurrentTrackInQueue = queue.findIndex(
    (track) => track.queueId === currentTrack?.queueId
  );
  return (
    <div className="flex flex-col gap-2 px-1 cursor-pointer @container">
      {queue.map((track, idx) => {
        const isCurrentTrack = track.queueId === currentTrack?.queueId;
        return (
          <div
            key={track.queueId}
            onClick={() => setCurrentTrack(track)}
            className={cn(
              "flex items-center gap-2 ",
              isCurrentTrack && "bg-green-500/30",
              //TODO: add option to hide/collapse previous tracks
              idx < idxOfCurrentTrackInQueue && "opacity-65"
            )}
          >
            <img
              src={track.albumCoverUrl}
              alt={track.title}
              className="w-16 h-16 rounded"
            />
            <div className="flex-1 flex flex-col">
              <span className="text-lg font-semibold">{track.title}</span>
              <TrackArtists
                artists={track.artists}
                textColor={isCurrentTrack ? "text-foreground" : undefined}
              />
            </div>
            <div className="flex">
              <TrackOptionsButton track={track} />
              <XIcon
                className="cursor-pointer"
                onClick={() => {
                  removeTrackFromQueue(track.queueId);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
