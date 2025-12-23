"use client";
import { PlusSquareIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { createPlaylist, getUserPlaylistsWithPreview } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";

export default function CreatePlaylist() {
  const supabase = createClient();
  const { data: myData } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = myData?.user?.id;
  const [name, setName] = useState("");
  if (!myID) return null;

  const { mutate: mutatePlaylists } = useSWR(
    ["getUserPlaylistsWithPreview", myID],
    () => getUserPlaylistsWithPreview(supabase, myID)
  );

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-32 min-h-32 flex flex-col items-center cursor-pointer">
          <PlusSquareIcon
            strokeWidth={0.75}
            className="w-32 h-32 text-foreground/70"
          />
          <span className="text-foreground/70 text-center">
            Create a new playlist
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create playlist</DialogTitle>
          <DialogDescription>Name your new playlist</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={async () => {
              try {
                await createPlaylist(supabase, myID, name);
                //refresh my playlists
                mutatePlaylists();
              } catch (e) {
                toast.error("Error creating playlist");
              }
              setIsOpen(false);
              toast.success(`Playlist ${name} created!`);
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
