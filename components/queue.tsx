"use client";
import { useStore } from "@/state/store";
import Link from "next/link";

export default function Queue() {
  const { queue, removeFromQueue } = useStore();
  return (
    <div className="flex flex-col gap-2">
      {queue.map((track) => (
        <div key={track.id} className="flex items-center gap-2">
          <img
            src={track.albumCoverUrl}
            alt={track.title}
            className="w-16 h-16 rounded"
          />
          <div>
            <h2 className="text-lg font-bold">{track.title}</h2>
            {track.artists.map((artist) => (
              <Link href={"/artists/" + artist.id} key={artist.id}>
                <span className="font-light">{artist.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
