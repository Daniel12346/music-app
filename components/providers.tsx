"use client";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "./ui/sidebar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class" defaultTheme="system">
      {/* <SWRConfig>{children}</SWRConfig>
       */}
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
