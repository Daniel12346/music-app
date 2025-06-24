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
  queuedFromSource: TrackWithExtra[];
  queuedByUser: TrackWithExtra[];
  prevTrack: TrackWithExtra | null;
  nextTrack: TrackWithExtra | null;
  queueIdOfCurrentTrack: string | null;
  isShuffleActive: boolean;
  setCurrentTrack: (track: TrackWithExtra | null) => void;
  setNextTrack: (track: TrackWithExtra | null) => void;
  setPrevTrack: (track: TrackWithExtra | null) => void;
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
}

//persist queue and current track state with zustand
export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      queuedByUser: [],
      queuedFromSource: [],
      currentTrack: null,
      prevTrack: null,
      nextTrack: null,
      queueIdOfCurrentTrack: null,
      isShuffleActive: false,

      setCurrentTrack: (track: TrackWithExtra | null) => {
        set({ currentTrack: track });
      },
      setNextTrack: (track: TrackWithExtra | null) => {
        set({ nextTrack: track });
      },
      setPrevTrack: (track: TrackWithExtra | null) => {
        set({ prevTrack: track });
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
        set({ queuedByUser: queue });
      },
      addTrackToQueue: (track: TrackWithExtra, position: Position = "end") =>
        set((state) => {
          const queuedByUser =
            position === "end"
              ? [...state.queuedByUser, track]
              : [track].concat(state.queuedByUser);
          return { queuedByUser };
        }),
      queueTracksFromSource: (tracks: TrackWithExtra[]) => {
        set({ queuedFromSource: tracks });
      },
      addTracksToQueue: (
        tracks: TrackWithExtra[],
        position: Position = "end"
      ) => {
        set((state) => {
          const queuedByUser =
            position === "end"
              ? [...state.queuedByUser, ...tracks]
              : tracks.concat(state.queuedByUser);
          return {
            queuedByUser,
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
            queuedByUser: state.queuedByUser.filter(
              (track) => track.queueId !== queueId
            ),
            currentTrack,
          };
        }),
      removeTrackFromUserQueue: (queueId: string) =>
        set((state) => ({
          queuedByUser: state.queuedByUser.filter(
            (track) => track.queueId !== queueId
          ),
        })),
      removeTrackFromSourceQueue: (queueId: string) =>
        set((state) => ({
          queuedFromSource: state.queuedFromSource.filter(
            (track) => track.queueId !== queueId
          ),
        })),
      toggleShuffle: () =>
        set((state) => ({ isShuffleActive: !state.isShuffleActive })),
    }),
    {
      name: "track-storage",
    }
  )
);
