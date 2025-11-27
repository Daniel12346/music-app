import { Undo2Icon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <span className="text-8xl">404</span>
      <h2 className="text-xl">Page not found</h2>
      <Link href="/" className="border-b-2 border-fuchsia-400">
        <div className="flex items-center gap-2 text-xl">
          Return Home
          <Undo2Icon size={20} className="text-fuchsia-600" />
        </div>
      </Link>
    </div>
  );
}
