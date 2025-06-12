import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import AudioPlayer from "@/components/audio-player";
import SidebarMobile from "@/components/sidebar-mobile";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen">
        <Providers>
          <div className="block md:hidden">
            <SidebarMobile />
          </div>
          <main className="w-full flex flex-col items-center">
            {children}
            <AudioPlayer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
