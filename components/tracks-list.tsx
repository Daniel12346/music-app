import { addNewQueueIdToTrack } from "@/lib/utils";
import { XIcon } from "lucide-react";
import LikeTrack from "./like-track";
import TrackArtists from "./track-artists";
import TrackOptionsButton from "./track-options";
import { useTrackStore } from "@/state/store";
import { TracksWithAlbumsAndArtists } from "@/lib/database";

export default function TracksList({
  tracks,
}: {
  tracks: TracksWithAlbumsAndArtists;
}) {
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack);
  tracks?.map((track) => {
    if (!track) return null;
    const trackWithExtra = {
      ...track,
      //TODO: treat same track on multiple albums as different tracks and/or add section to /track/id with albums where track appears
      albumCoverUrl: track.albums_tracks[0].albums.cover_url || "",
      albumId: track.albums_tracks[0].albums.id || "",
      artists: track.tracks_artists.map((artist) => artist.artists) || [],
      albumName: track.albums_tracks[0].albums.title || "",
    };

    return (
      <div
        key={track.id}
        className="flex cursor-pointer items-center gap-2  @container"
        onClick={
          () => setCurrentTrack(addNewQueueIdToTrack(trackWithExtra)) // Add queueId to track
          //TODO: set queue to something (history tracks?)
        }
      >
        <img
          src={trackWithExtra.albumCoverUrl || ""}
          alt={track.title}
          className="w-10 h-10 rounded"
        />
        <div className="flex-1 flex flex-col">
          <span className="text-lg ">{track.title}</span>

          <TrackArtists
            artists={track.tracks_artists.map((artist) => artist.artists)}
          />
        </div>

        <div
          className="flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <TrackOptionsButton track={trackWithExtra} />
          <LikeTrack
            trackID={track.id}
            // size={size}
            // strokeColor={strokeColor}
            trackAlbumID={track.albums_tracks[0].albums.id}
          />
          <XIcon />
        </div>
      </div>
    );
  });
}
