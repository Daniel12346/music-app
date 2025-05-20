"use client";
import { cn } from "@/lib/utils";
import { useTrackStore } from "@/state/store";
import { XIcon } from "lucide-react";
import Link from "next/link";

export default function Queue() {
  const { queue, removeTrackFromQueue, idxOfCurrentTrackInQueue } =
    useTrackStore();
  return (
    <div className="flex flex-col gap-2">
      {queue.map((track, idx) => (
        //track.id alone can't be used as key because the same track can be added to queue multiple times
        //TOOD: find better key
        <div
          key={track.id + idx}
          className={cn(
            "flex items-center gap-2",
            idx === idxOfCurrentTrackInQueue && "bg-green-500/40"
          )}
        >
          <Link href={"/albums/" + track.albumId}>
            <img
              src={track.albumCoverUrl}
              alt={track.title}
              className="w-16 h-16 rounded"
            />
          </Link>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{track.title}</h2>
            {track.artists.map((artist) => (
              <Link href={"/artists/" + artist.id} key={artist.id}>
                <span className="font-light">{artist.name}</span>
              </Link>
            ))}
          </div>
          <div>
            <XIcon
              className="cursor-pointer"
              onClick={() => {
                removeTrackFromQueue(track.id, idx);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
