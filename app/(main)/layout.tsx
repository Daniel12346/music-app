import Queue from "@/components/queue";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "@/components/header";
import Liked from "@/components/tracks-sidebar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        <ResizablePanel className="hidden md:block" defaultSize={25}>
          <Liked />
        </ResizablePanel>
        <ResizableHandle className="hidden md:block" />
        <ResizablePanel defaultSize={50} minSize={20}>
          {children}
        </ResizablePanel>
        <ResizableHandle className="hidden md:block" />
        <ResizablePanel className="hidden md:block" defaultSize={25}>
          <Queue />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
