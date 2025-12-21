"use client";
import { getUserProfile } from "@/lib/database";
import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function Settings() {
  const supabase = createClient();
  const {
    data: myData,
    isLoading: isMyDataLoading,
    isValidating: isMyDataValidating,
  } = useSWR("me", () => supabase.auth.getUser().then((res) => res.data));
  const {
    data: myProfileData,
    isLoading,
    isValidating,
    mutate: mutateUserProfile,
  } = useSWR(
    myData?.user?.id ? ["getUserProfile", myData?.user?.id] : null,
    () => getUserProfile(supabase, myData?.user?.id!)
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col items-center">
        <div className="relative group">
          {isLoading || isMyDataLoading ? (
            <Skeleton className="w-40 h-40 rounded-full" />
          ) : (
            <Image
              src={myProfileData?.avatar_url || ""}
              alt={myProfileData?.username || ""}
              width={50}
              height={50}
              className="w-40 h-40 rounded-full object-cover object-top"
            />
          )}
          <div className="hidden h-full group-hover:flex items-center absolute top-0 backdrop-brightness-50  rounded-full">
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (!myProfileData) return;
                const myID = myData?.user?.id;
                if (!e.target.files || !myID) return;
                const file = e.target.files[0];
                const { data: uploadData, error: uploadError } =
                  await supabase.storage
                    .from("avatars")
                    .upload(`${myID}/${file.name}.jpg`, e.target.files[0], {
                      upsert: true,
                    });
                if (uploadError) {
                  console.log(uploadError);
                }
                const {
                  data: { publicUrl },
                } = supabase.storage
                  .from("avatars")
                  .getPublicUrl(`${myID}/${file.name}.jpg`);
                const { data: updateData, error: updateError } = await supabase
                  .from("profiles")
                  .update({
                    avatar_url: publicUrl,
                  })
                  .eq("id", myID);
                if (updateError) {
                  console.log(updateError);
                }
                mutateUserProfile({
                  ...myProfileData,
                });
              }}
            />
          </div>
        </div>
        <h1 className="text-xl ">{myProfileData?.username}</h1>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col space-x-2 p-3 md:p-0 max-w-md">
          <div className="flex gap-1">
            <Switch
              id="profile-visibility"
              className="data-[state=checked]:bg-fuchsia-400"
            />
            <Label htmlFor="profile-visibility" className="text-lg font-light">
              Hide profile
            </Label>
          </div>
          <div>
            <span className="font-light text-muted-foreground">
              By hiding your profile, other users will not be able to find you
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
