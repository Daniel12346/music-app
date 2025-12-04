import { ThemeSwitcher } from "./theme-switcher";
import { SidebarTrigger } from "./ui/sidebar";
import Search from "./search-bar";
import UserAvatar from "./user-avatar";
import AuthLink from "./auth-link";
import logo1 from "../public/logo1.svg";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex w-full gap-6 md:gap-16 items-center justify-between  px-4 py-2 bg-background border-b border-border">
      <SidebarTrigger className="md:hidden" />
      <Link href="/">
        <div className="flex items-center gap-1">
          <img
            src={logo1.src}
            alt="Logo"
            width={20}
            height={10}
            className="w-15 h-10 "
          />
          <span className="text-2xl font-light font-sans hidden md:block">
            <span className="text-fuchsia-500">Music</span>
            <span>App</span>
          </span>
        </div>
      </Link>
      <Search />
      <div className="flex w-20 gap-4 justify-end items-center">
        <AuthLink />
        <UserAvatar />
        <ThemeSwitcher />
      </div>
    </div>
  );
}
