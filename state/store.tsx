import { Tables } from "@/database.types";
import { create } from "zustand";
import { combine } from "zustand/middleware";

type Track = Tables<"tracks">;
export const useStore = create(
  combine(
    {
      trackUrl: "",
      queue: [] as Track[],
    },
    (set) => ({
      setTrackUrl: (url: string) => set({ trackUrl: url }),
      clearTrackUrl: () => set({ trackUrl: "" }),
      addToQueue: (track: Track) =>
        set((state) => ({ queue: [...state.queue, track] })),
      removeFromQueue: (trackId: string) =>
        set((state) => ({
          queue: state.queue.filter((track) => track.id !== trackId),
        })),
    })
  )
);
