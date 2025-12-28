import {
  updateCanUserEditPlaylist,
  unsharePlaylistWithUser,
  getProfileSearchResultsWithSharingStatus,
} from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { DropdownMenuItem } from "./ui/dropdown-menu";

export default function PlaylistSharedWithUsers({
  playlistId,
  searchQuery,
}: {
  playlistId: string;
  searchQuery: string;
}) {
  const supabase = createClient();
  const { data: profileSearchResults, mutate: mutateProfileSearchResults } =
    useSWR(["getProfileSearchResultsWithSharingStatus", searchQuery], () =>
      getProfileSearchResultsWithSharingStatus(
        supabase,
        searchQuery,
        playlistId
      )
    );
  const sharedWithUsers =
    profileSearchResults?.filter(
      (profile) => profile.playlists_shared_with_users.length > 0
    ) ?? [];

  return sharedWithUsers?.map((profile) => {
    const canEdit = profile.playlists_shared_with_users[0].can_edit ?? false;
    return (
      <DropdownMenuItem className="flex justify-between" key={profile.id}>
        {profile.username}
        <div className="flex items-center">
          <Checkbox
            className="ml-1 cursor-pointer"
            checked={canEdit}
            onClick={async (e) => {
              e.stopPropagation();
              //toggling whether user can edit playlist
              try {
                await updateCanUserEditPlaylist(
                  supabase,
                  playlistId,
                  profile.id,
                  !canEdit
                );
                mutateProfileSearchResults((prev) =>
                  prev?.map((p) => {
                    if (p.id === profile.id) {
                      return {
                        ...p,
                        playlists_shared_with_users:
                          p.playlists_shared_with_users.map((p) => {
                            if (p.shared_with_user_id === profile.id) {
                              return {
                                ...p,
                                can_edit: !canEdit,
                              };
                            }
                            return p;
                          }),
                      };
                    }
                    return p;
                  })
                );
              } catch (e) {
                toast.error("Failed to allow user to edit playlist");
              }
            }}
          />
          <Trash2Icon
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await unsharePlaylistWithUser(supabase, playlistId, profile.id);
                mutateProfileSearchResults((prev) =>
                  prev?.map((p) => {
                    if (p.id === profile.id) {
                      return {
                        ...p,
                        playlists_shared_with_users: [],
                      };
                    }
                    return p;
                  })
                );
              } catch (e) {
                toast.error("Failed to remove user from playlist");
              }
            }}
            size={18}
            className="ml-4 cursor-pointer hover:text-red-400"
          />
        </div>
      </DropdownMenuItem>
    );
  });
}
