"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";

export default function AuthLink() {
  const supabase = createClient();
  const { data, isValidating } = useSWR("me", () =>
    supabase.auth.getUser().then((res) => res.data)
  );
  const myID = data?.user?.id;
  return (
    !myID &&
    !isValidating && (
      <Link className="text-sm underline" href="/sign-in">
        <Button
          className="text-sm cursor-pointer text-fuchsia-400 hover:text-fuchsia-400 border-fuchsia-500 dark:border-fuchsia-300"
          variant={"outline"}
        >
          Sign in
        </Button>
      </Link>
    )
  );
}
