"use client";
import { cn } from "@/lib/utils";
import { TrackWithExtra, useTrackStore } from "@/state/store";
import { ListIcon, XIcon } from "lucide-react";
import TrackArtists from "./track-artists";
import TrackOptionsButton from "./track-options";
import { useEffect, useMemo } from "react";
import Link from "next/link";

export default function Queue() {
  const {
    userQueue,
    sourceQueue,
    currentTrack,
    removeTrackFromSourceQueue,
    removeTrackFromUserQueue,
    isShuffleActive,
    setUserQueue,
    setPrevTrack,
    setNextTrack,
    setLastPlayedSourceTrack,
    lastPlayedSourceTrack,
    setCurrentTrack,
    currentSourceName,
    currentSourceId,
    currentSourceType,
  } = useTrackStore();

  const sortedSourceQueue = useMemo(
    () =>
      isShuffleActive
        ? //sort randomly
          sourceQueue.toSorted(() => Math.random() - 0.5)
        : sourceQueue,
    [sourceQueue, isShuffleActive]
  );
  const idxOfCurrentTrackInSourceQueue = sortedSourceQueue.findIndex(
    (track) => track.queueId === currentTrack?.queueId
  );
  const idxOfCurrentTrackInUserQueue = userQueue.findIndex(
    (track) => track.queueId === currentTrack?.queueId
  );
  const idxofLastPlayedSourceTrackInSourceQueue = sortedSourceQueue.findIndex(
    (track) => track.queueId === lastPlayedSourceTrack?.queueId
  );
  useEffect(() => {
    //if the current track is in the source queue
    if (idxOfCurrentTrackInSourceQueue !== -1) {
      setLastPlayedSourceTrack(
        sortedSourceQueue[idxOfCurrentTrackInSourceQueue]
      );
    }
    if (userQueue.length) {
      if (idxOfCurrentTrackInUserQueue !== -1) {
        if (userQueue.length === 1) {
          //if the current track is the last track in the user queue,
          //set the next track to the first track in the rest of the source queue
          //(the track after last played track from source queue)
          const nextTrackIdx =
            idxofLastPlayedSourceTrackInSourceQueue === -1
              ? 0
              : idxofLastPlayedSourceTrackInSourceQueue + 1;
          setNextTrack(sortedSourceQueue[nextTrackIdx]);
        } else {
          setNextTrack(userQueue[idxOfCurrentTrackInUserQueue + 1]);
        }
        setUserQueue(userQueue.slice(1));
        setPrevTrack(lastPlayedSourceTrack);
      }
    } else {
      if (idxOfCurrentTrackInSourceQueue !== -1) {
        setPrevTrack(sortedSourceQueue[idxOfCurrentTrackInSourceQueue - 1]);
      } else {
        setPrevTrack(null);
      }
      if (idxOfCurrentTrackInSourceQueue < sortedSourceQueue.length - 1) {
        setNextTrack(sortedSourceQueue[idxOfCurrentTrackInSourceQueue + 1]);
      } else {
        setNextTrack(null);
      }
    }
  }, [currentTrack, sortedSourceQueue]);

  //updating the next and prev track if the user queue changes
  useEffect(() => {
    if (userQueue.length) {
      if (idxOfCurrentTrackInUserQueue !== -1) {
        setPrevTrack(userQueue[idxOfCurrentTrackInUserQueue - 1]);
      } else {
        setPrevTrack(null);
      }
      if (idxOfCurrentTrackInUserQueue < userQueue.length - 1) {
        setNextTrack(userQueue[idxOfCurrentTrackInUserQueue + 1]);
      } else {
        setNextTrack(null);
      }
    } else {
    }
  }, [userQueue]);
  const QueueTrack = ({
    track,
    isCurrent = false,
    isQueuedByUser = false,
  }: {
    track: TrackWithExtra;
    isCurrent?: boolean;
    isQueuedByUser?: boolean;
  }) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2",
          isCurrent &&
            "border-y-highlight/50 border-y-2 py-1 bg-highlight/5 text-highlight"
        )}
        onClick={(e) => {
          e.stopPropagation();
          setCurrentTrack(track);
        }}
      >
        <img
          src={track.albumCoverUrl}
          alt={track.title}
          className="w-16 h-16 rounded"
        />
        <div className="flex-1 flex flex-col">
          <span className="text-lg font-semibold">{track.title}</span>
          <TrackArtists artists={track.artists} textColor="text-foreground" />
        </div>
        <div className="flex text-foreground">
          {isQueuedByUser && <ListIcon stroke="var(--color-fuchsia-500)" />}
          <TrackOptionsButton track={track} />
          <XIcon
            className="cursor-pointer"
            onClick={() => {
              isQueuedByUser
                ? removeTrackFromUserQueue(track.queueId)
                : removeTrackFromSourceQueue(track.queueId);
            }}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-2 px-1 cursor-pointer @container">
      {currentTrack && (
        <>
          <span className="text-lg font-semibold text-muted-foreground cursor-default">
            Now playing
          </span>
          <QueueTrack track={currentTrack} isCurrent />
        </>
      )}
      {userQueue.length > 0 && (
        <span className="text-lg font-semibold text-muted-foreground mt-4 cursor-default">
          Queued
        </span>
      )}
      {userQueue.map((track) => (
        <QueueTrack key={track.queueId} track={track} isQueuedByUser />
      ))}
      {/* TODO: source name */}
      {sortedSourceQueue.length > 0 && (
        <span className="text-lg font-semibold text-muted-foreground mt-4 cursor-default">
          Next from:{" "}
          <Link
            className="hover:underline"
            href={
              currentSourceType === "PLAYLIST"
                ? `/playlists/${currentSourceId}`
                : currentSourceType === "ALBUM"
                  ? `/albums/${currentSourceId}`
                  : currentSourceType === "ARTIST"
                    ? `/artists/${currentSourceId}`
                    : ""
            }
          >
            {currentSourceName}
          </Link>
        </span>
      )}
      {sortedSourceQueue
        .slice(idxofLastPlayedSourceTrackInSourceQueue + 1)
        .map((track) => {
          return <QueueTrack key={track.queueId} track={track} />;
        })}
    </div>
  );
}
