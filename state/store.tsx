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

//the position of the track in the queue
type Position = "start" | "end";
//the source from which the track was played
type SourceType =
  | "ALBUM"
  | "PLAYLIST"
  | "ARTIST"
  | "HISTORY"
  | "LIKED"
  | "NEW_RELEASES";

interface TrackStore {
  currentTrack: TrackWithExtra | null;
  sourceQueue: TrackWithExtra[];
  userQueue: TrackWithExtra[];
  prevTrack: TrackWithExtra | null;
  nextTrack: TrackWithExtra | null;
  lastPlayedSourceTrack: TrackWithExtra | null;
  isShuffleActive: boolean;
  isRepeatActive: boolean;
  isPlaying: boolean;
  query: string;
  currentSourceName: string | null;
  currentSourceId: string | null;
  currentSourceType: SourceType | null;
  setCurrentTrack: (
    track: TrackWithExtra | null,
    sourceId?: string | null,
    sourceType?: SourceType | null,
    sourceName?: string | null
  ) => void;
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
  setQuery: (query: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentSource: (
    sourceName: string,
    sourceType: SourceType,
    sourceId: string
  ) => void;
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
      isPlaying: false,
      query: "",
      currentSourceName: null,
      currentSourceId: null,
      currentSourceType: null,
      setCurrentTrack: (
        track: TrackWithExtra | null,
        sourceId?: string | null,
        sourceType?: SourceType | null,
        sourceName?: string | null
      ) => {
        //if sourceId, sourceType and sourceName are not provided, use the previous values
        set((prev) => ({
          currentTrack: track,
          currentSourceId:
            sourceId === undefined ? prev.currentSourceId : sourceId,
          currentSourceType:
            sourceType === undefined ? prev.currentSourceType : sourceType,
          currentSourceName:
            sourceName === undefined ? prev.currentSourceName : sourceName,
        }));
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
      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
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
      setQuery: (query: string) => set({ query }),
      setCurrentSource: (sourceName, sourceType, sourceId) => {
        set({
          currentSourceName: sourceName,
          currentSourceType: sourceType,
          currentSourceId: sourceId,
        });
      },
    }),

    {
      name: "track-storage",
    }
  )
);
