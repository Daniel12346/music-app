import { Tables } from "@/database.types";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export type TrackWithExtra = Tables<"tracks"> & {
  albumId: string;
  albumName: string;
  albumCoverUrl: string;
  artists: Pick<Tables<"artists">, "id" | "name">[];
};
type Position = "start" | "end";
export const useStore = create(
  combine(
    {
      currentTrack: null as TrackWithExtra | null,
      queue: [] as TrackWithExtra[],
      idxOfCurrentTrackInQueue: 0 as number,
    },
    (set) => ({
      setCurrentTrack: (track: TrackWithExtra | null, idx = 0) => {
        set({ currentTrack: track, idxOfCurrentTrackInQueue: idx });
      },
      playNextTrack: () => {
        set((state) => {
          const nextTrackIdx = state.idxOfCurrentTrackInQueue + 1;
          let nextTrack = null;
          if (nextTrackIdx < state.queue.length) {
            nextTrack = state.queue[nextTrackIdx];
          }
          return {
            currentTrack: nextTrack,
            idxOfCurrentTrackInQueue: nextTrackIdx,
          };
        });
      },
      playPrevTrack: () => {
        set((state) => {
          const prevTrackIdx = state.idxOfCurrentTrackInQueue - 1;
          let prevTrack = null;
          if (prevTrackIdx >= 0) {
            prevTrack = state.queue[prevTrackIdx];
          }
          return {
            currentTrack: prevTrack,
            idxOfCurrentTrackInQueue: prevTrackIdx,
          };
        });
      },
      setQueue: (queue: TrackWithExtra[]) => {
        set({ queue });
      },
      addTrackToQueue: (track: TrackWithExtra, position: Position = "end") =>
        set((state) => {
          const idxOfCurrentTrackInQueue =
            position === "start" && state.queue.length
              ? state.idxOfCurrentTrackInQueue + 1
              : state.idxOfCurrentTrackInQueue;
          const queue =
            position === "end"
              ? [...state.queue, track]
              : [track].concat(state.queue);
          return { queue, idxOfCurrentTrackInQueue };
        }),

      addTracksToQueue: (
        tracks: TrackWithExtra[],
        position: Position = "end"
      ) => {
        set((state) => {
          const idxOfCurrentTrackInQueue =
            position === "start" && state.queue.length
              ? state.idxOfCurrentTrackInQueue + tracks.length
              : state.idxOfCurrentTrackInQueue;
          const queue =
            position === "end"
              ? [...state.queue, ...tracks]
              : tracks.concat(state.queue);
          return {
            queue,
            idxOfCurrentTrackInQueue,
          };
        });
      },
      removeTrackFromQueue: (trackId: string, idx: number) =>
        set((state) => {
          let idxOfCurrentTrackInQueue = state.idxOfCurrentTrackInQueue;
          //reducing the index of the track currently playing if a song with a lower index (before it) was removed
          if (idx < idxOfCurrentTrackInQueue) {
            idxOfCurrentTrackInQueue--;
          }
          return {
            queue: state.queue.filter((track) => track.id !== trackId),
            idxOfCurrentTrackInQueue: idxOfCurrentTrackInQueue,
          };
        }),
    })
  )
);
