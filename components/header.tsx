import AuthButton from "./header-auth";
import { ThemeSwitcher } from "./theme-switcher";

export default function Header() {
  return (
    <div className="flex w-full gap-16 items-center justify-between px-4 py-2 bg-background border-b border-border">
      <AuthButton />
      <ThemeSwitcher />
    </div>
  );
}
