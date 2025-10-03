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
  sourceQueue: TrackWithExtra[];
  userQueue: TrackWithExtra[];
  prevTrack: TrackWithExtra | null;
  nextTrack: TrackWithExtra | null;
  lastPlayedSourceTrack: TrackWithExtra | null;
  isShuffleActive: boolean;
  isRepeatActive: boolean;
  setCurrentTrack: (track: TrackWithExtra | null) => void;
  setNextTrack: (track: TrackWithExtra | null) => void;
  setPrevTrack: (track: TrackWithExtra | null) => void;
  setLastPlayedSourceTrack: (track: TrackWithExtra | null) => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  setQueue: (queue: TrackWithExtra[]) => void;
  queueTracksFromSource: (tracks: TrackWithExtra[]) => void;
  addTrackToQueue: (track: TrackWithExtra, position?: Position) => void;
  addTracksToQueue: (tracks: TrackWithExtra[], position?: Position) => void;
  removeTrackFromQueue: (queueId: string) => void;
  removeTrackFromSourceQueue: (queueId: string) => void;
  removeTrackFromUserQueue: (queueId: string) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setUserQueue: (queue: TrackWithExtra[]) => void;
}

//persist queue and current track state with zustand
export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      userQueue: [],
      sourceQueue: [],
      currentTrack: null,
      prevTrack: null,
      nextTrack: null,
      lastPlayedSourceTrack: null,
      isShuffleActive: false,
      isRepeatActive: false,
      setCurrentTrack: (track: TrackWithExtra | null) => {
        set({ currentTrack: track });
      },
      setNextTrack: (track: TrackWithExtra | null) => {
        set({ nextTrack: track });
      },
      setPrevTrack: (track: TrackWithExtra | null) => {
        set({ prevTrack: track });
      },
      setLastPlayedSourceTrack: (track: TrackWithExtra | null) => {
        set({ lastPlayedSourceTrack: track });
      },
      playNextTrack: () => {
        set((state) => {
          return {
            currentTrack: state.nextTrack,
          };
        });
      },
      playPrevTrack: () => {
        set((state) => {
          return {
            currentTrack: state.prevTrack,
          };
        });
      },
      setQueue: (queue: TrackWithExtra[]) => {
        set({ userQueue: queue });
      },
      //
      addTrackToQueue: (track: TrackWithExtra, position: Position = "end") =>
        set((state) => {
          const userQueue =
            position === "end"
              ? [...state.userQueue, track]
              : [track].concat(state.userQueue);
          return { userQueue };
        }),
      queueTracksFromSource: (tracks: TrackWithExtra[]) => {
        set({ sourceQueue: tracks });
      },
      addTracksToQueue: (
        tracks: TrackWithExtra[],
        position: Position = "end"
      ) => {
        set((state) => {
          const userQueue =
            position === "end"
              ? [...state.userQueue, ...tracks]
              : tracks.concat(state.userQueue);
          return {
            userQueue,
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
            userQueue: state.userQueue.filter(
              (track) => track.queueId !== queueId
            ),
            currentTrack,
          };
        }),
      removeTrackFromUserQueue: (queueId: string) =>
        set((state) => ({
          userQueue: state.userQueue.filter(
            (track) => track.queueId !== queueId
          ),
        })),
      setUserQueue: (queue: TrackWithExtra[]) => set({ userQueue: queue }),
      removeTrackFromSourceQueue: (queueId: string) =>
        set((state) => ({
          sourceQueue: state.sourceQueue.filter(
            (track) => track.queueId !== queueId
          ),
        })),
      toggleShuffle: () =>
        set((state) => ({ isShuffleActive: !state.isShuffleActive })),
      toggleRepeat: () =>
        set((state) => ({ isRepeatActive: !state.isRepeatActive })),
    }),
    {
      name: "track-storage",
    }
  )
);
