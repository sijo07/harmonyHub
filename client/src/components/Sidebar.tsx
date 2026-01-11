import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  Library,
  Heart,
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Radio,
  BarChart2,
  Sparkles,
  Shield,
  Music4
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: Search, label: "Discover", path: "/search" },
  { icon: Library, label: "My Library", path: "/library" },
  { icon: BarChart2, label: "Stats", path: "/stats" },
];

const browseItems = [
  { icon: Radio, label: "Live Radio", path: "/radio" },
  { icon: Sparkles, label: "AI Agent", path: "/agent" },
]

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [playlistFilter, setPlaylistFilter] = useState("");
  const sidebarRef = useRef<HTMLElement>(null);

  const startResizing = () => setIsResizing(true);
  const stopResizing = () => setIsResizing(false);

  useEffect(() => {
    const resize = (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
        if (newWidth > 80 && newWidth < 480) {
          setWidth(newWidth);
          if (newWidth < 180 && !collapsed) setCollapsed(true);
          if (newWidth > 180 && collapsed) setCollapsed(false);
        }
      }
    };

    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }

    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, collapsed]);

  const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path?: string, active?: boolean }) => {
    const content = (
      <div
        className={cn(
          "flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-300 relative group overflow-hidden",
          active
            ? "text-white bg-white/5 box-glow" // New glow class
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        )}
      >
        {/* Active Neon Indicator */}
        {active && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-rose-600 rounded-r-full shadow-[0_0_15px_var(--neon-pink)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        <Icon className={cn("w-5 h-5 flex-shrink-0 relative z-10 transition-transform duration-300", active && "scale-105 text-primary drop-shadow-[0_0_8px_rgba(255,51,153,0.6)]")} style={{ marginLeft: active ? '8px' : '0px' }} />

        {!collapsed && (
          <span className={cn("font-medium whitespace-nowrap text-sm relative z-10 tracking-wide", collapsed && "hidden")}>
            {label}
          </span>
        )}
      </div>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              {path ? <Link to={path} className="w-full flex justify-center py-1">{content}</Link> : <div className="cursor-pointer w-full flex justify-center py-1">{content}</div>}
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black/80 backdrop-blur-xl border-white/10 text-white shadow-xl">
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return path ? <Link to={path}>{content}</Link> : <div className="cursor-pointer">{content}</div>;
  };

  return (
    <motion.aside
      ref={sidebarRef}
      className={cn(
        "h-[calc(100vh-2rem)] m-4 rounded-2xl flex flex-col relative z-30 group/sidebar overflow-hidden transition-all",
        // Enhanced Futuristic Glass Effect
        "glass-panel-pro"
      )}
      style={{ width: collapsed ? 90 : width }}
      animate={{ width: collapsed ? 90 : width }}
      transition={{ duration: isResizing ? 0 : 0.4, type: "spring", bounce: 0, damping: 15 }}
    >
      {/* Resizer */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 bg-transparent hover:bg-white/10 cursor-col-resize z-50 transition-all"
        onMouseDown={startResizing}
      />

      {/* Header */}
      <div className="p-6 flex items-center justify-between flex-shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-rose-900 flex items-center justify-center shadow-[0_0_20px_rgba(255,51,153,0.4)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Music4 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white text-glow">
                Harmony
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-500 hover:text-white hover:bg-white/10 ml-auto w-8 h-8 rounded-full"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 scrollbar-hide">
        <div className="space-y-8 pb-4">
          <nav className="space-y-1">
            <p className={cn("text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 px-2 transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>Main Menu</p>
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          <nav className="space-y-1">
            <p className={cn("text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 px-2 transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>Discover</p>
            {browseItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          {user?.isAdmin && (
            <nav className="space-y-1">
              <p className={cn("text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4 px-2 transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>System</p>
              <SidebarItem icon={Shield} label="Admin" path="/admin" active={location.pathname.startsWith('/admin')} />
            </nav>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-3">
              <p className={cn("text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>
                Collection
              </p>
              {!collapsed && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon-sm" className="h-5 w-5 hover:text-white text-zinc-500">
                        <PlusCircle className="w-3.5 h-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Create Playlist</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <SidebarItem
              icon={Heart}
              label="Liked Songs"
              path="/liked"
              active={location.pathname === "/liked"}
            />

            {!collapsed && (
              <div className="pt-2 space-y-2">
                {/* Playlist Search */}
                <div className="relative mb-2 px-1">
                  <Search className="w-3 h-3 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Filter..."
                    className="h-8 pl-8 bg-white/5 border-white/5 text-xs focus-visible:ring-primary/50 rounded-lg placeholder:text-zinc-700 transition-all focus:bg-white/10"
                    value={playlistFilter}
                    onChange={(e) => setPlaylistFilter(e.target.value)}
                  />
                </div>

                <div className="space-y-0.5 max-h-[200px] overflow-y-auto scrollbar-hide">
                  {user?.playlists?.filter(p => (p.name || "").toLowerCase().includes(playlistFilter.toLowerCase())).map((playlist) => (
                    <Link key={playlist._id || playlist.id} to={`/playlist/${playlist._id || playlist.id}`} className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all truncate hover:pl-4">
                      {playlist.name}
                    </Link>
                  ))}
                  {user?.playlists?.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-xs text-zinc-600">No playlists yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {user && (
        <div className="p-4 mt-auto">
          <div className={cn(
            "rounded-xl bg-white/5 border border-white/5 p-3 flex items-center gap-3 transition-all duration-300 hover:bg-white/10 hover:border-white/10 group cursor-pointer backdrop-blur-md",
            collapsed ? "justify-center p-2" : ""
          )}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                <span className="text-sm font-bold text-white">{user.name[0].toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate group-hover:text-primary transition-colors">{user.name}</p>
                <p className="text-[10px] text-zinc-500 truncate font-mono">Free Plan</p>
              </div>
            )}

            {!collapsed && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={logout}
                className="text-zinc-500 hover:text-primary hover:bg-primary/10 h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
};

