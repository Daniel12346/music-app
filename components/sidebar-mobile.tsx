import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Liked from "./tracks-sidebar";

export default function SidebarMobile() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <Liked />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
