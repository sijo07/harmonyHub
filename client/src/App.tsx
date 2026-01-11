import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "@/contexts/PlayerContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/MainLayout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Library from "./pages/Library";
import PlaylistPage from "./pages/Playlist";
import AlbumDetails from "./pages/AlbumDetails";
import ArtistDetails from "./pages/ArtistDetails";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminSettings from "./pages/Admin/AdminSettings";
import AIAgent from "./pages/Agent/AIAgent";
import LikedSongs from "./pages/LikedSongs";
import Profile from "./pages/Profile";
import AuthPage from "./pages/Auth";
import { Suspense } from "react";
import { MusicLoader } from "@/components/ui/MusicLoader";
import { NotFound } from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Radio from "./pages/Radio";
import NewReleases from "./pages/NewReleases";
import Stats from "./pages/Stats";
import UnderConstruction from "./pages/UnderConstruction";

const queryClient = new QueryClient();

// Root Application Component
const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PlayerProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<MusicLoader />}>
                <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/radio" element={<Radio />} />
                    <Route path="/new" element={<NewReleases />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/playlist/:id" element={<PlaylistPage />} />
                    <Route path="/album/:id" element={<AlbumDetails />} />
                    <Route path="/artist/:id" element={<ArtistDetails />} />
                    <Route path="/liked" element={<LikedSongs />} />
                    <Route path="/stats" element={<Stats />} />

                    {/* Admin Routes - Should be protected by Route wrapper in real app */}
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    <Route path="/profile" element={<Profile />} />

                    <Route path="/agent" element={<AIAgent />} />
                    <Route path="/maintenance" element={<UnderConstruction />} />
                    <Route path="/undefined" element={<Navigate to="/" replace />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </PlayerProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
// Force rebuild
