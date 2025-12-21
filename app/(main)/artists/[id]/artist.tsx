"use client";
import AlbumsDisplay from "@/components/albums-display";
import LikeArtist from "@/components/like-artist";
import TracksList from "@/components/tracks-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllArtistTracks,
  getArtistWithAlbumsAndTopTracks,
} from "@/lib/database";
import { SortKey } from "@/lib/types";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function Artist() {
  const client = createClient();
  const { id } = useParams<{ id: string }>();
  const { data: artist } = useSWR(
    ["getArtistWithAlbumsAndTopTracks", id],
    () => getArtistWithAlbumsAndTopTracks(client, id)
  );
  const { data: artistWithAllTracks } = useSWR(["getAllArtistTracks", id], () =>
    getAllArtistTracks(client, id)
  );
  const { tracks: topTracks } = artist!;
  const { tracks: allTracks } = artistWithAllTracks!;
  const sortKeys: SortKey[] = [
    "newest_first",
    "oldest_first",
    "A-to-Z",
    "Z-to-A",
  ];
  const topTracksWithExtraInfo = topTracks?.map((track) => ({
    ...track,
    albumName: track.albums_tracks[0].albums.title ?? "",
    albumCoverUrl: track.albums_tracks[0].albums.cover_url ?? "",
    albumId: track.albums_tracks[0].albums.id,
    artists: track.tracks_artists.map((trackArtist) => ({
      id: trackArtist.artists.id,
      name: trackArtist.artists.name,
    })),
  }));
  const allTracksWithExtraInfo = allTracks?.map((track) => ({
    ...track,
    albumName: track.albums_tracks[0].albums.title ?? "",
    albumCoverUrl: track.albums_tracks[0].albums.cover_url ?? "",
    albumId: track.albums_tracks[0].albums.id,
    artists: track.tracks_artists.map((trackArtist) => ({
      id: trackArtist.artists.id,
      name: trackArtist.artists.name,
    })),
  }));
  const [currentSortKey, setCurrentSortKey] = useState<SortKey>("newest_first");
  return (
    <div>
      <div className="relative">
        <div className="absolute top-1 right-1">
          <LikeArtist size={32} artistID={artist?.id!} />
        </div>
        <Image
          src={artist?.image_url || ""}
          alt={artist?.name || ""}
          width={300}
          height={100}
          className="w-full h-50 object-cover object-center"
        />
        <h1 className="absolute bottom-0.5 left-0.5 z-10 text-6xl text-white bg-black/50">
          {artist?.name}
        </h1>
      </div>
      <span className="text-2xl pl-2 opacity-90">Popular tracks</span>
      <div className="flex flex-col items-center mt-2">
        <TracksList
          //only the top 5 most popular tracks are shown, but all the artist's tracks are queued when one of them is clicked
          tracks={topTracksWithExtraInfo}
          tracksToQueue={allTracksWithExtraInfo}
          sourceId={artist?.id}
          sourceName={artist?.name}
          sourceType="ARTIST"
        />
      </div>
      <div className="flex items-baseline-last pl-2 pt-4 mb-2">
        <span className="text-2xl opacity-90">Albums</span>
        <Select onValueChange={(value: SortKey) => setCurrentSortKey(value)}>
          <SelectTrigger className="ml-2 mt-2 border-1px rounded-sm">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            {sortKeys.map((sortKey) => (
              <SelectItem key={sortKey} value={sortKey}>
                {sortKey.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {artist?.albums && (
        <div>
          <AlbumsDisplay
            showArtistName={false}
            showReleasedAt
            albums={artist?.albums}
            sortKey={currentSortKey}
          />
        </div>
      )}
    </div>
  );
}
