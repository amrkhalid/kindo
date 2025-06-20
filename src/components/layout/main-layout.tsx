import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./sidebar-nav";
import { Navbar } from "./navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import kindoLogo from "@/assets/kindo-logo.png";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function MainLayout() {
  const isMobile = useIsMobile();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const renderSidebar = () => (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          "flex items-center justify-between mb-4 sm:mb-6 md:mb-8",
          isSidebarCollapsed && "justify-center"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isSidebarCollapsed && "justify-center"
          )}
        >
          {isSidebarCollapsed ? (
            <div className="h-8 w-8 rounded-full bg-[#1A5F5E] flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
          ) : (
            <>
              <img src={kindoLogo} alt="kindo" className="h-8 w-auto" />
            </>
          )}
        </div>
      </div>
      <SidebarNav className="flex-1" isCollapsed={isSidebarCollapsed} />
      <div
        className={cn(
          "border-t pt-4 mt-4",
          isSidebarCollapsed && "text-center"
        )}
      >
        <p className="text-xs text-muted-foreground">© 2025 kindo</p>
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-screen flex", isRTL ? "rtl" : "ltr")}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <div
          className={cn(
            "border-r bg-background transition-all duration-300 relative",
            isSidebarCollapsed ? "w-16" : "w-64",
            isRTL ? "border-l border-r-0" : "border-r"
          )}
        >
          <div className="p-4">{renderSidebar()}</div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute h-6 w-6 rounded-full border bg-background shadow-md",
              "hover:bg-muted transition-all duration-200",
              "flex items-center justify-center",
              isRTL ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
              "top-6"
            )}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? (
              isRTL ? (
                <ChevronLeft className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )
            ) : isRTL ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar>
          {/* Mobile menu button */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn("mr-2", isRTL && "ml-2 mr-0")}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? "right" : "left"}
                className="w-64 p-4"
              >
                {renderSidebar()}
              </SheetContent>
            </Sheet>
          )}
        </Navbar>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
