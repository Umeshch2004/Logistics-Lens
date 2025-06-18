import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
// AppHeader will be part of each page for dynamic titles, or can be included here if static

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        {/* AppHeader could be here if title is managed globally or removed if per-page */}
        <div className="flex flex-col flex-1 min-h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
