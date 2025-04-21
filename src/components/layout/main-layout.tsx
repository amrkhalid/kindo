
import React from "react";
import { SidebarNav } from "./sidebar-nav";
import { Navbar } from "./navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();

  // For desktop view - always show sidebar
  if (!isMobile) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r bg-background p-4 flex flex-col">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-kindergarten-purple">Bloom Hub</h2>
            <p className="text-sm text-muted-foreground">Kindergarten Management</p>
          </div>
          <SidebarNav className="flex-1" />
          <div className="border-t pt-4 mt-4">
            <p className="text-xs text-muted-foreground">© 2025 Bloom Hub</p>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    );
  }

  // For mobile view - show sidebar in a sheet
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-kindergarten-purple">Bloom Hub</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="mb-8 mt-4">
              <h2 className="text-2xl font-bold text-kindergarten-purple">Bloom Hub</h2>
              <p className="text-sm text-muted-foreground">Kindergarten Management</p>
            </div>
            <SidebarNav />
            <div className="border-t pt-4 mt-8">
              <p className="text-xs text-muted-foreground">© 2025 Bloom Hub</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <main className="p-4 flex-1">{children}</main>
    </div>
  );
}
