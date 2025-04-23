import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./sidebar-nav";
import { Navbar } from "./navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import kendoLogo from "@/assets/kindo-logo.png";

export function MainLayout() {
  const isMobile = useIsMobile();

  const renderSidebar = () => (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <img src={kendoLogo} alt="Kendo" className="h-8 w-auto" />
        </div>
        <p className="text-sm text-muted-foreground">Kindergarten Management</p>
      </div>
      <SidebarNav className="flex-1" />
      <div className="border-t pt-4 mt-4">
        <p className="text-xs text-muted-foreground">© 2025 Kendo</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="w-64 border-r bg-background p-4">
          {renderSidebar()}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar>
          {/* Mobile menu button */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                {renderSidebar()}
              </SheetContent>
            </Sheet>
          )}
        </Navbar>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
