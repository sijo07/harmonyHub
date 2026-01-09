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
    <div className="flex h-screen overflow-hidden text-foreground bg-black">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide relative w-full">
        {/* Adjusted padding for mobile bottom nav + player */}
        <div className="min-h-[calc(100vh-6rem)] pb-32 md:pb-24">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Persistent Player */}
      <Player />
    </div>
  );
};
