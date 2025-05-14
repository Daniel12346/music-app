import { Tables } from "@/database.types";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export type TrackWithExtra = Tables<"tracks"> & {
  albumId: string;
  albumName: string;
  albumCoverUrl: string;
  artists: Pick<Tables<"artists">, "id" | "name">[];
};
export const useStore = create(
  combine(
    {
      trackUrl: "",
      queue: [] as TrackWithExtra[],
    },
    (set) => ({
      setTrackUrl: (url: string) => set({ trackUrl: url }),
      clearTrackUrl: () => set({ trackUrl: "" }),
      addToQueue: (track: TrackWithExtra) =>
        set((state) => ({ queue: [...state.queue, track] })),
      removeFromQueue: (trackId: string) =>
        set((state) => ({
          queue: state.queue.filter((track) => track.id !== trackId),
        })),
    })
  )
);
