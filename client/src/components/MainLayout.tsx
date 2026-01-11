import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "@/components/MobileNav";

export const MainLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative">
      {/* Ambient background glow effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar - Desktop Glass Dock */}
      <div className="hidden md:flex z-20 relative">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background pt-20 md:pt-0 pb-36 md:pb-0 transition-all duration-300">
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="min-h-full px-4 md:px-6 pt-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Persistent Player - Floating Glass Deck */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-0 md:px-0">
        <Player />
      </div>
    </div>
  );
};
