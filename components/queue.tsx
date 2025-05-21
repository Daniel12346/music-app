"use client";
import { cn } from "@/lib/utils";
import { useTrackStore } from "@/state/store";
import { EllipsisVerticalIcon, XIcon } from "lucide-react";
import Link from "next/link";

export default function Queue() {
  const { queue, removeTrackFromQueue, currentTrack, setCurrentTrack } =
    useTrackStore();
  const idxOfCurrentTrackInQueue = queue.findIndex(
    (track) => track.queueId === currentTrack?.queueId
  );
  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      {queue.map((track, idx) => (
        //track.id alone can't be used as key because the same track can be added to queue multiple times
        <div
          key={track.queueId}
          onClick={() => setCurrentTrack(track)}
          className={cn(
            "flex items-center gap-2",
            track.queueId === currentTrack?.queueId && "bg-green-500/40",
            //TODO: add option to hide/collapse previous tracks
            idx < idxOfCurrentTrackInQueue && "opacity-65"
          )}
        >
          <img
            src={track.albumCoverUrl}
            alt={track.title}
            className="w-16 h-16 rounded"
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{track.title}</h2>
            {track.artists.map((artist) => (
              <Link href={"/artists/" + artist.id} key={artist.id}>
                <span className="font-light hover:underline">
                  {artist.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex">
            <EllipsisVerticalIcon />
            <XIcon
              className="cursor-pointer"
              onClick={() => {
                removeTrackFromQueue(track.queueId);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
