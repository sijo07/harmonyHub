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
  Disc,
  Mic2,
  Radio,
  BarChart2,
  Sparkles,
  Shield
} from "lucide-react";
import logo from "@/assets/logo.png";
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
  { icon: BarChart2, label: "Stats", path: "/stats" }, // New "Advanced" item
];

const browseItems = [
  { icon: Radio, label: "Live Radio", path: "/radio" },
  { icon: Disc, label: "New Releases", path: "/new" },
  { icon: Mic2, label: "Podcasts", path: "/podcasts" },
  { icon: Sparkles, label: "AI Agent", path: "/agent" },
]

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  // ... (rest of hook logic unchanged) ...
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
          "flex items-center gap-4 px-3 py-2.5 rounded-lg transition-all duration-300 relative group overflow-hidden",
          active
            ? "text-white"
            : "text-zinc-400 hover:text-white hover:bg-white/5"
        )}
      >
        {/* Active Indicator (Neon Tube) */}
        {active && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 top-1 bottom-1 w-1 bg-[#FF0000] rounded-r-full shadow-[0_0_15px_#FF0000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Glow Background for active */}
        {active && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent opacity-50" />
        )}

        <Icon className={cn("w-5 h-5 flex-shrink-0 relative z-10 transition-transform duration-300", active && "scale-105 text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]")} style={{ marginLeft: active ? '6px' : '0px' }} />

        {!collapsed && (
          <span className={cn("font-medium whitespace-nowrap text-sm relative z-10", collapsed && "hidden")}>
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
            <TooltipContent side="right" className="bg-black/90 border-red-900/50 text-white">
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
        "h-[calc(100vh-2rem)] m-4 rounded-xl flex flex-col border border-white/5 relative z-30 group/sidebar overflow-hidden",
        // Glassmorphism
        "bg-black/60 backdrop-blur-2xl shadow-2xl"
      )}
      style={{ width: collapsed ? 90 : width }}
      animate={{ width: collapsed ? 90 : width }}
      transition={{ duration: isResizing ? 0 : 0.4, type: "spring", bounce: 0, damping: 15 }}
    >
      {/* Drag Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1 hover:w-1.5 bg-transparent hover:bg-red-500/50 cursor-col-resize z-50 transition-all"
        onMouseDown={startResizing}
      />

      {/* Logo */}
      <div className="p-6 flex items-center justify-between flex-shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                <img src={logo} alt="Logo" className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Harmony<span className="text-red-500">Hub</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-zinc-500 hover:text-white hover:bg-white/5 ml-auto w-8 h-8"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Main Navigation */}
        <div className="space-y-6">
          <nav className="space-y-1">
            <p className={cn("text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2 transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>Menu</p>
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          {/* Discover */}
          <nav className="space-y-1">
            <p className={cn("text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2 transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>Discover</p>
            {browseItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          {/* Admin Section */}
          {user?.isAdmin && (
            <nav className="space-y-1">
              <p className={cn("text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2 transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>Admin</p>
              <SidebarItem icon={Shield} label="Admin" path="/admin" active={location.pathname.startsWith('/admin')} />
            </nav>
          )}

          {/* Playlists */}
          <div className="space-y-1">
            <p className={cn("text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-2 transition-opacity", collapsed && "opacity-0 h-0 overflow-hidden")}>
              Your Collection
            </p>

            <SidebarItem
              icon={Heart}
              label="Liked Songs"
              path="/liked"
              active={location.pathname === "/liked"}
            />
            <SidebarItem icon={PlusCircle} label="Create Playlist" active={false} />

            {!collapsed && (
              <div className="pt-4  space-y-2">
                <Input
                  placeholder="Search..."
                  className="h-8 bg-white/5 border-white/10 text-xs focus-visible:ring-red-500/50 rounded-md placeholder:text-zinc-600"
                  value={playlistFilter}
                  onChange={(e) => setPlaylistFilter(e.target.value)}
                />
                <div className="space-y-0.5 pt-2">
                  {/* Real Playlists from User */}
                  {user?.playlists?.filter(p => (p.name || "").toLowerCase().includes(playlistFilter.toLowerCase())).map((playlist) => (
                    <Link key={playlist._id || playlist.id} to={`/playlist/${playlist._id || playlist.id}`} className="block px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-all truncate">
                      {playlist.name}
                    </Link>
                  ))}
                  {/* Fallback to show empty state if no playlists, or maybe just keep it clean */}
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* User Section - Glass Card */}
      {user && (
        <div className="p-4 mt-auto">
          <div className={cn(
            "rounded-xl bg-gradient-to-b from-white/5 to-white/0 border border-white/5 p-3 flex items-center gap-3 transition-all duration-300 hover:border-white/10 group",
            collapsed ? "justify-center p-2" : ""
          )}>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 shadow-lg">
                <span className="text-sm font-bold text-white">{user.name[0].toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black"></div>
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
              </div>
            )}

            {!collapsed && (
              <Button variant="ghost" size="icon-sm" onClick={logout} className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 h-7 w-7 rounded-md">
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
};
