"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Home,
  Layers,
  MapPin,
  List,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  User,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { adminLogout } from "@/server/actions/admin";
import { toast } from "sonner";

interface AdminShellClientProps {
  children: React.ReactNode;
  userEmail: string;
}

export default function AdminShellClient({ children, userEmail }: AdminShellClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      const res = await adminLogout();
      if (res.success) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error("Logout failed");
      }
    });
  };

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/homepage", label: "Hero CMS", icon: Home },
    { href: "/admin/categories", label: "Categories CMS", icon: Layers },
    { href: "/admin/locations", label: "Locations CMS", icon: MapPin },
    { href: "/admin/listings", label: "Listings CRUD", icon: List },
  ];

  return (
    <div className="min-h-screen flex bg-background font-sans">
      {/* ── MOBILE BACKDROP ── */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity" 
        />
      )}

      {/* ── SIDEBAR PANEL (Desktop / Drawer Mobile) ── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-card border-r border-border/80 transform transition-transform duration-300 lg:static lg:transform-none select-none
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${!isSidebarOpen ? "lg:w-20" : "lg:w-72"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <circle cx="35" cy="32" r="12" fill="#cf4f41" />
              <path d="M15 75 C 15 50, 55 50, 55 75 Z" fill="#cf4f41" />
              <circle cx="65" cy="32" r="12" fill="#202e4d" />
              <path d="M45 75 C 45 50, 85 50, 85 75 Z" fill="#202e4d" />
            </svg>
            {(isSidebarOpen || isMobileOpen) && (
              <div className="flex flex-col leading-none">
                <span className="text-xl font-black text-foreground tracking-tight font-heading">Oklute</span>
                <span className="text-[9px] font-bold text-[#f06e2e] tracking-widest uppercase mt-0.5">Console</span>
              </div>
            )}
          </div>

          {/* Desktop collapse button inside sidebar */}
          {isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-muted text-foreground cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all select-none
                  ${isActive 
                    ? "bg-[#cf4f41] text-white shadow-md shadow-[#cf4f41]/10" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {(isSidebarOpen || isMobileOpen) && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/80 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-4 overflow-hidden bg-muted/40">
            <div className="w-9 h-9 rounded-full bg-[#cf4f41]/10 border border-[#cf4f41]/20 flex items-center justify-center text-[#cf4f41] font-bold shrink-0">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            {(isSidebarOpen || isMobileOpen) && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-foreground truncate">{userEmail}</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Admin</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTAINER ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-card border-b border-border/80 flex items-center justify-between px-6 sm:px-8 select-none shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button (desktop) - visible only when collapsed */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="hidden lg:flex p-2 rounded-lg hover:bg-muted text-foreground cursor-pointer transition-colors"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Sidebar toggle button (mobile) */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted text-foreground cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-lg font-bold text-foreground font-heading">
              {navLinks.find((l) => l.href === pathname)?.label || "Admin Console"}
            </h1>
          </div>

          {/* Theme switcher / utilities */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-lg border border-border/80 bg-background text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {!mounted ? (
                <span className="w-5 h-5 block" />
              ) : theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
