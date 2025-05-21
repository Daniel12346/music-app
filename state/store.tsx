import { Tables } from "@/database.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TrackWithExtra = Tables<"tracks"> & {
  albumId: string;
  albumName: string;
  albumCoverUrl: string;
  artists: Pick<Tables<"artists">, "id" | "name">[];
  queueId: string;
};

type Position = "start" | "end";

interface TrackStore {
  currentTrack: TrackWithExtra | null;
  queue: TrackWithExtra[];
  setCurrentTrack: (track: TrackWithExtra | null) => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  setQueue: (queue: TrackWithExtra[]) => void;
  addTrackToQueue: (track: TrackWithExtra, position?: Position) => void;
  addTracksToQueue: (tracks: TrackWithExtra[], position?: Position) => void;
  removeTrackFromQueue: (queueId: string) => void;
}

//persist queue and current track state with zustand
export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      queue: [],
      currentTrack: null,
      queueIdOfCurrentTrack: null,
      setCurrentTrack: (track: TrackWithExtra | null) => {
        set({ currentTrack: track });
      },
      playNextTrack: () => {
        set((state) => {
          const currentTrackIdx = state.queue.findIndex(
            (track) => track.queueId === state.currentTrack?.queueId
          );
          if (currentTrackIdx === -1) return state;
          const nextTrackIdx = currentTrackIdx + 1;
          let nextTrack = null;
          if (nextTrackIdx < state.queue.length) {
            nextTrack = state.queue[nextTrackIdx];
          }
          return {
            currentTrack: nextTrack,
          };
        });
      },
      playPrevTrack: () => {
        set((state) => {
          const prevTrackIdx = state.queue.findIndex(
            (track) => track.queueId === state.currentTrack?.queueId
          );
          if (prevTrackIdx === -1) return state;
          let prevTrack = null;
          if (prevTrackIdx > 0) {
            prevTrack = state.queue[prevTrackIdx - 1];
          }
          return {
            currentTrack: prevTrack,
          };
        });
      },
      setQueue: (queue: TrackWithExtra[]) => {
        set({ queue });
      },
      addTrackToQueue: (track: TrackWithExtra, position: Position = "end") =>
        set((state) => {
          const queue =
            position === "end"
              ? [...state.queue, track]
              : [track].concat(state.queue);
          return { queue };
        }),

      addTracksToQueue: (
        tracks: TrackWithExtra[],
        position: Position = "end"
      ) => {
        set((state) => {
          const queue =
            position === "end"
              ? [...state.queue, ...tracks]
              : tracks.concat(state.queue);
          return {
            queue,
          };
        });
      },
      removeTrackFromQueue: (queueId: string) =>
        set((state) => {
          let currentTrack = state.currentTrack;
          //removing the track from the queue if it was the current track
          if (queueId === state.currentTrack?.queueId) {
            currentTrack = null;
          }
          return {
            queue: state.queue.filter((track) => track.queueId !== queueId),
            currentTrack,
          };
        }),
    }),
    {
      name: "track-storage",
    }
  )
);
