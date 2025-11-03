"use client";
import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserProfile } from "@/lib/database";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useRef } from "react";
import { UserRoundCogIcon } from "lucide-react";

export default function AuthButton() {
  const supabase = createClient();
  const {
    data: myData,
    isLoading: isMyDataLoading,
    isValidating: isMyDataValidating,
  } = useSWR("me", () => supabase.auth.getUser().then((res) => res.data));
  const {
    data: myProfile,
    isLoading,
    isValidating,
  } = useSWR(
    myData?.user?.id ? ["getUserProfile", myData?.user?.id] : null,
    () => getUserProfile(supabase, myData?.user?.id!)
  );
  const inputRef = useRef<HTMLInputElement>(null);
  return myData ? (
    <div className="flex items-center gap-4 w-full">
      {/* TODO: user profile image */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10 group">
            <AvatarImage
              className="rounded-full cursor-pointer"
              src={myProfile?.avatar_url || ""}
              alt={myProfile?.username || ""}
            />
            <AvatarFallback>{myProfile?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit flex flex-col gap-1">
          <DropdownMenuLabel className="text-md">
            {myProfile?.username}
          </DropdownMenuLabel>
          <div className="px-3 cursor-pointer flex gap-1">
            <UserRoundCogIcon />
            <Link href="/settings">Account settings</Link>
          </div>
          <DropdownMenuItem>
            <form action={signOutAction}>
              <Button
                type="submit"
                variant={"secondary"}
                className="cursor-pointer"
              >
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    !isLoading && !isValidating && !isMyDataLoading && !isMyDataValidating && (
      <div className="flex gap-2">
        <Button asChild size="sm" variant={"outline"}>
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild size="sm" variant={"default"}>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    )
  );
}
