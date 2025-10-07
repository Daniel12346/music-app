import AuthButton from "./header-auth";
import { ThemeSwitcher } from "./theme-switcher";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <div className="flex w-full gap-4 md:gap-16 items-center justify-between px-4 py-2 bg-background border-b border-border">
      <SidebarTrigger className="md:hidden" />
      <div className="hidden md:flex">
        <AuthButton />
      </div>
      <div className="max-w-lg w-full relative group">
        <Input placeholder="Search..." className="w-full" />
        <div className="absolute w-full max-h-40 overflow-y-scroll left-0 h-16 z-20 bg-accent hidden group-focus-within:flex shadow-md">
          {/* //TODO: searching */}
        </div>
      </div>
      <div className="w-6 flex justify-center">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
