import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Shirt,
  Palette,
  Box,
  Bot,
  TrendingUp,
  Video,
  Settings,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Wardrobe", href: "/wardrobe", icon: Shirt },
  { name: "Style Creator", href: "/style-creator", icon: Palette },
  { name: "3D Studio", href: "/3d-studio", icon: Box },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { name: "Trends", href: "/trends", icon: TrendingUp },
  { name: "Video Generator", href: "/video-generator", icon: Video },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-border">
            <Sparkles className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-xl font-bold">FashionForge</h1>
              <p className="text-xs text-muted-foreground">Studio</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              <p>FashionForge Studio v1.0</p>
              <p className="mt-1">© 2024 All rights reserved</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>

            <div className="flex-1 lg:flex-none">
              <h2 className="text-lg font-semibold">
                {navigation.find((item) => item.href === location.pathname)
                  ?.name || "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assist
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}