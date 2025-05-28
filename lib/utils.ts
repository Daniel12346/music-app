import { TrackWithExtra } from "@/state/store";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateId = () => Math.random().toString(36).substring(2, 9);
export const addNewQueueIdToTrack = (
  track: Omit<TrackWithExtra, "queueId">,
) => {
  return {
    ...track,
    queueId: generateId(),
  };
};
