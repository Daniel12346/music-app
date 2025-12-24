import {
  Edit2Icon,
  LockKeyholeOpenIcon,
  LockKeyholeIcon,
  Trash2Icon,
  LockOpenIcon,
  LockIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import {
  getPlaylist,
  makePlaylistPrivate,
  makePlaylistPublic,
} from "@/lib/database";
import useSWR from "swr";
import { toast } from "sonner";

export default function PlaylistSettings({
  isPublic,
  id,
}: {
  isPublic: boolean;
  id: string;
}) {
  const supabase = createClient();
  const { mutate: mutatePlaylist } = useSWR(["getPlaylist", id], () =>
    getPlaylist(supabase, id)
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Edit2Icon size={16} className="cursor-pointer" />
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
                      icon: <LockIcon size={16} />,
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
                      icon: <LockOpenIcon size={16} />,
                    });
                  } catch (e) {
                    toast.error("Failed to make playlist public");
                  }
                }
          }
        >
          {isPublic ? (
            <>
              <LockKeyholeOpenIcon size={16} />
              Make private
            </>
          ) : (
            <>
              <LockKeyholeIcon size={16} />
              Make public
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-1 bg-destructive">
          <Trash2Icon size={16} />
          Delete playlist
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
