import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Player from "@/components/audio-player";
import Queue from "@/components/queue";
import Header from "@/components/header";

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
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Providers>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              <div className="col-span-full">
                <Header />
              </div>
              <div className="md:col-start-2 bg-green-200 ">{children}</div>
              <Player />
              <div className="hidden md:block md:col-start-3 bg-blue-200/20  px-5">
                <Queue />
              </div>
            </div>
          </Providers>
        </main>
      </body>
    </html>
  );
}
