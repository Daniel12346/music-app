"use client";
import AlbumCard from "@/components/album-card";
import LikeAlbum from "@/components/like-album";
import TracksList from "@/components/tracks-list";
import { TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getAlbumWithTracksAndArtist } from "@/lib/database";
import { addNewQueueIdToTrack } from "@/lib/utils";
import { useTrackStore } from "@/state/store";
import { createClient } from "@/utils/supabase/client";
import { Tooltip } from "@radix-ui/react-tooltip";
import { ClockIcon, ListEndIcon, ListStartIcon } from "lucide-react";
import { useParams } from "next/navigation";
import useSWR from "swr";

export default function Album() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const { data: albumWithTracks, error } = useSWR(
    ["getAlbumWithTracksAndArtist", id],
    () => getAlbumWithTracksAndArtist(supabase, id)
  );
  const addTracksToQueue = useTrackStore((state) => state.addTracksToQueue);
  const tracksWithExtraInfo = albumWithTracks?.tracks.map((track) => ({
    ...track,
    albumName: albumWithTracks.title,
    albumCoverUrl: albumWithTracks.cover_url!,
    albumId: albumWithTracks.id,
    artists: track.tracks_artists.map((trackArtist) => ({
      id: trackArtist.artists.id,
      name: trackArtist.artists.name,
    })),
  }));
  const totalDurationInSeconds =
    tracksWithExtraInfo?.reduce((acc, track) => {
      const [hours, minutes, seconds] = (track.length as string).split(":");
      const totalSeconds =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
      return acc + totalSeconds;
    }, 0) ?? 0;
  //formatted total duration in hours, minutes, seconds
  const totalDuration = new Date(totalDurationInSeconds * 1000)
    .toISOString()
    .slice(11, 19);
  if (error) {
    return <div>Error loading album</div>;
  }
  if (!albumWithTracks) {
    return <div>No album found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-2">
        <AlbumCard
          isMain
          id={albumWithTracks.id}
          title={albumWithTracks.title}
          cover_url={albumWithTracks.cover_url}
          artists={albumWithTracks.artists}
          size="large"
        />

        <div className="mt-2">
          <div className="flex items-center gap-2  justify-between">
            <div className="flex">
              <div className="flex gap-1 items-center">
                <ClockIcon size={20} />
                {totalDuration}
              </div>
              <div className="flex gap-1 items-center">
                ,
                <span>
                  {tracksWithExtraInfo?.length}{" "}
                  {tracksWithExtraInfo?.length.toString().endsWith("1")
                    ? "track"
                    : "tracks"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <ListStartIcon
                    className="cursor-pointer"
                    size={22}
                    onClick={() => {
                      addTracksToQueue(
                        tracksWithExtraInfo?.map((track) =>
                          addNewQueueIdToTrack(track)
                        )!,
                        "start"
                      );
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to start of queue</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <ListEndIcon
                    className="cursor-pointer"
                    size={22}
                    onClick={() => {
                      addTracksToQueue(
                        tracksWithExtraInfo?.map((track) =>
                          addNewQueueIdToTrack(track)
                        )!,
                        "end"
                      );
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to end of queue</p>
                </TooltipContent>
              </Tooltip>
              <LikeAlbum albumID={albumWithTracks.id} size={22} />
            </div>
          </div>
        </div>
      </div>

      <TracksList
        tracks={tracksWithExtraInfo || []}
        sourceType="ALBUM"
        sourceId={albumWithTracks.id}
        sourceName={albumWithTracks.title}
        withBorder
      />
    </div>
  );
}
