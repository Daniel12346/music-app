import { create } from "zustand";

interface TrackStoreState {
  trackUrl: string;
  setTrackUrl: (url: string) => void;
}
export const useTrackStore = create<TrackStoreState>()((set) => ({
  trackUrl: "",
  setTrackUrl: (url) => set({ trackUrl: url }),
}));
