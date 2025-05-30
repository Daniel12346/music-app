// In Next.js, this file would be called: app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class" defaultTheme="system">
      {/* <SWRConfig>{children}</SWRConfig>
       */}
      {children}
    </ThemeProvider>
  );
}
