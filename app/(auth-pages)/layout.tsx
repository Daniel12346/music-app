import NoteSocial from "@/public/note_social.svg";
import { CheckCircleIcon } from "lucide-react";
import Image from "next/image";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full md:flex-row">
      <div className="md:w-1/2 flex flex-col gap-4 pt-6 pb-8 items-center justify-center bg-fuchsia-950  md:order-2">
        <Image
          src={NoteSocial}
          alt="Note Social"
          className="md:order-2 w-full max-w-sm"
        />
        <div className="text-background/80 dark:text-foreground/80">
          <span className="text-2xl">Join MusicApp to:</span>
          <ul className="text-xl flex flex-col gap-2 md:gap-3 mt-2">
            <li className="flex">
              <CheckCircleIcon className="text-fuchsia-500 mr-2" size={25} />
              create your own&nbsp;
              <span className="text-fuchsia-500"> playlists</span>
            </li>
            <li className="flex">
              <CheckCircleIcon className="text-fuchsia-500 mr-2" size={25} />
              <span className="text-fuchsia-500">like</span> &nbsp;your favorite
              music
            </li>
            <li className="flex">
              <CheckCircleIcon className="text-fuchsia-500 mr-2" size={25} />
              view your
              <span className="text-fuchsia-500">&nbsp;listening history</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full h-full md:w-1/2 flex items-center pb-10 md:pb-0">
        {children}
      </div>
    </div>
  );
}
