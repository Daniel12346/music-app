import { ThemeSwitcher } from "./theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";
import Search from "./search-bar";
import UserAvatar from "./user-avatar";
import AuthLink from "./auth-link";

export default function Header() {
  return (
    <div className="flex w-full gap-4 md:gap-16 items-center justify-between px-4 py-2 bg-background border-b border-border">
      <SidebarTrigger className="md:hidden" />
      <div className="w-20 hidden md:flex"></div>
      <Search />
      <div className="flex w-20 gap-4 justify-end items-center">
        <AuthLink />
        <UserAvatar />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
