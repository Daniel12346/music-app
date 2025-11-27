import Queue from "@/components/queue";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "@/components/header";
import Liked from "@/components/tracks-sidebar";
import SidebarMobile from "@/components/sidebar-mobile";
import AudioPlayer from "@/components/audio-player";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "MusicApp",
  description: "A music streaming app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full flex flex-col items-center">
      <div className="block md:hidden">
        <SidebarMobile />
      </div>
      <div className="block md:hidden">
        <SidebarMobile />
      </div>
      <Header />
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen pb-60"
      >
        <ResizablePanel
          className="hidden md:block"
          defaultSize={25}
          minSize={10}
        >
          <Liked />
        </ResizablePanel>
        <ResizableHandle className="hidden md:block w-0.75 " />
        <ResizablePanel defaultSize={50} minSize={20} className="mt-4">
          {children}
        </ResizablePanel>
        <ResizableHandle className="hidden md:block w-0.75" />
        <ResizablePanel
          className="hidden md:block"
          defaultSize={25}
          minSize={10}
        >
          <Queue />
        </ResizablePanel>
      </ResizablePanelGroup>
      <AudioPlayer />
    </main>
  );
}
