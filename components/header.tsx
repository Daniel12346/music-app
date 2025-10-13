import AuthButton from "./header-auth";
import { ThemeSwitcher } from "./theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";
import Search from "./search-bar";

export default function Header() {
  return (
    <div className="flex w-full gap-4 md:gap-16 items-center justify-between px-4 py-2 bg-background border-b border-border">
      <SidebarTrigger className="md:hidden" />
      <div className="hidden md:flex">
        <AuthButton />
      </div>
      <Search />
      <div className="w-6 flex justify-center">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
