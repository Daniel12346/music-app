import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Avatar } from "@radix-ui/react-avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AvatarImage } from "./ui/avatar";
import { getProfile } from "@/lib/database";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userProfile = await getProfile(supabase, user?.id!);

  return user ? (
    <div className="flex items-center gap-4 w-full">
      {/* TODO: user profile image */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10">
            <AvatarImage
              className="rounded-full "
              src={userProfile?.avatar_url || ""}
              alt={userProfile?.username || ""}
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <form action={signOutAction}>
              <Button type="submit" variant={"outline"}>
                Sign out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
