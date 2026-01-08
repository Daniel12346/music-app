import {
  Edit2Icon,
  LockKeyholeOpenIcon,
  LockKeyholeIcon,
  Trash2Icon,
  LockOpenIcon,
  LockIcon,
  UserPlus2Icon,
  ChevronRightIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import {
  deletePlaylist,
  getPlaylist,
  getProfileSearchResultsWithSharingStatus,
  getUserPlaylistsWithPreview,
  makePlaylistPrivate,
  makePlaylistPublic,
  sharePlaylistWithUser,
} from "@/lib/database";
import useSWR from "swr";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";
import PlaylistSharedWithUsers from "./playlist-shared-with-users";

export default function PlaylistSettings({ id }: { id: string }) {
  const supabase = createClient();
  const { data: myData } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const [profileSearchQuery, setProfileSearchQuery] = useState("");
  const { data: profileSearchResults, mutate: mutateProfileSearchResults } =
    useSWR(
      ["getProfileSearchResultsWithSharingStatus", profileSearchQuery],
      () =>
        getProfileSearchResultsWithSharingStatus(
          supabase,
          profileSearchQuery,
          id
        )
    );
  const myID = myData?.user?.id;
  const { mutate: mutatePlaylist, data: playlist } = useSWR(
    ["getPlaylist", id],
    () => getPlaylist(supabase, id)
  );
  const { mutate: mutateMyPlaylists } = useSWR(
    myID ? ["getUserPlaylistsWithPreview", myID] : null,
    () => getUserPlaylistsWithPreview(supabase, myID!)
  );
  const isPublic = playlist?.status === "PUBLIC";
  const router = useRouter();
  //the only entry in the playlist_shared_with_users refers to this playlist
  const sharedWithUsers =
    profileSearchResults?.filter(
      (profile) => profile.playlists_shared_with_users.length > 0
    ) ?? [];
  const notSharedWithUsers =
    profileSearchResults?.filter(
      (profile) => profile.playlists_shared_with_users.length === 0
    ) ?? [];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Edit2Icon size={18} className="cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="flex gap-1"
          onClick={
            isPublic
              ? async () => {
                  try {
                    await makePlaylistPrivate(supabase, id);
                    await mutatePlaylist(
                      (prev) => prev && { ...prev, status: "PRIVATE" }
                    );
                    toast.success("Playlist made private", {
                      icon: <LockIcon size={18} />,
                    });
                  } catch (e) {
                    toast.error("Failed to make playlist private");
                  }
                }
              : async () => {
                  try {
                    await makePlaylistPublic(supabase, id);
                    await mutatePlaylist(
                      (prev) => prev && { ...prev, status: "PUBLIC" }
                    );
                    toast.success("Playlist made public", {
                      icon: <LockOpenIcon size={18} />,
                    });
                  } catch (e) {
                    toast.error("Failed to make playlist public");
                  }
                }
          }
        >
          {isPublic ? (
            <>
              <LockKeyholeOpenIcon size={18} />
              Make private
            </>
          ) : (
            <>
              <LockKeyholeIcon size={18} />
              Make public
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-1">
          <UserPlus2Icon size={18} /> Share with users
          <div className="flex">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ChevronRightIcon size={18} className="-mr-2" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sharedWithUsers?.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="ml-1 text-foreground/70">
                      Shared with{" "}
                    </span>
                    <span className="mr-5 font-light text-foreground/70">
                      can edit:
                    </span>
                  </div>
                )}
                <PlaylistSharedWithUsers
                  playlistId={id}
                  searchQuery={profileSearchQuery}
                />
                <DropdownMenuItem className="relative">
                  <Input
                    //TODO: fix input losing focus
                    autoFocus={false}
                    placeholder="search users"
                    value={profileSearchQuery}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onChange={(e) => {
                      setProfileSearchQuery(e.target.value);
                    }}
                  />
                  <SearchIcon
                    size={18}
                    className="absolute right-3 stroke-foreground"
                  />
                </DropdownMenuItem>
                {notSharedWithUsers?.length > 0 && (
                  <div className="flex justify-between text-sm text-foreground/70">
                    <span className="ml-1">Add user </span>
                  </div>
                )}
                {notSharedWithUsers
                  ?.filter(
                    (profile) =>
                      profile.playlists_shared_with_users.length === 0
                  )
                  .map((profile) => (
                    <DropdownMenuItem
                      className="flex justify-between"
                      key={profile.id}
                    >
                      <span>{profile.username}</span>
                      <PlusIcon
                        className="cursor-pointer"
                        size={18}
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await sharePlaylistWithUser(
                              supabase,
                              id,
                              profile.id,
                              false
                            );
                          } catch (e) {
                            toast.error("Failed to share playlist with user");
                          }
                        }}
                      />
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex gap-1 bg-destructive"
          onClick={async () => {
            try {
              await deletePlaylist(supabase, id);
              toast.success(`Playlist deleted`);
              //updating the cache so the deleted playlist is not shown on the home screen when the user is redirected there
              mutateMyPlaylists(
                (prev) => prev && prev.filter((p) => p.id !== id)
              );
              router.push("/");
            } catch (e) {
              toast.error("Error deleting playlist");
            }
          }}
        >
          <Trash2Icon size={18} />
          Delete playlist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
