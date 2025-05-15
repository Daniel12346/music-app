import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import AudioPlayer from "@/components/audio-player";
import Queue from "@/components/queue";
import Header from "@/components/header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
        <main className=" flex flex-col items-center">
          <Providers>
            <div className="w-full">
              <Header />
            </div>
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-screen"
            >
              <ResizablePanel className="hidden md:block" defaultSize={25}>
                //TODO: this panel
              </ResizablePanel>
              <ResizableHandle withHandle className="hidden md:block" />
              <ResizablePanel defaultSize={50}>{children}</ResizablePanel>
              <ResizableHandle withHandle className="hidden md:block" />
              <ResizablePanel className="hidden md:block" defaultSize={25}>
                <span>Queue</span>
                <Queue />
              </ResizablePanel>
            </ResizablePanelGroup>
          </Providers>
        </main>
      </body>
    </html>
  );
}
