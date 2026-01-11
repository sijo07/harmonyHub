import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Grid, List, Plus, Search, Heart, Disc3, Music2, Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaylistCard } from "@/components/PlaylistCard";
import { TrackCard } from "@/components/TrackCard";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { api, convertImage } from "@/services/api";

type FilterType = "all" | "playlists" | "albums" | "artists" | "podcasts";

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-25, 25], [10, -10]);
  const rotateY = useTransform(mouseX, [-25, 25], [-10, 10]);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("relative group perspective-1000", className)}
    >
      <div style={{ transform: "translateZ(20px)" }} className="h-full transition-transform duration-200">
        {children}
      </div>
    </motion.div>
  );
};

const Library = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [newPlaylistImage, setNewPlaylistImage] = useState("");
  const { user, loading, checkUser } = useAuth(); // Assuming checkUser re-fetches user data

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await api.createPlaylist({
        name: newPlaylistName,
        description: newPlaylistDesc,
        coverUrl: newPlaylistImage
      });
      setNewPlaylistName("");
      setNewPlaylistDesc("");
      setNewPlaylistImage("");
      setShowCreateDialog(false);
      // Refresh user data to show new playlist
      await checkUser();
    } catch (error) {
      console.error("Failed to create playlist", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File is too large. Max 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPlaylistImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const url = `https://picsum.photos/seed/${randomId}/500/500`;
    setNewPlaylistImage(url);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading library...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Please log in to view your library</h2>
      </div>
    );
  }

  const likedTracks = user.likedSongs || [];
  const myPlaylists = user.playlists || [];

  const mapSongToTrack = (song: any) => ({
    id: song.id,
    title: song.title || song.name,
    artist: song.artist || song.artists?.primary?.[0]?.name || "Unknown",
    album: song.album || "Unknown Album",
    coverUrl: song.image || song.coverUrl ? convertImage(song.image || []) : "",
    duration: parseInt(song.duration) || 0,
    audioUrl: song.previewUrl || song.audioUrl || song.downloadUrl?.[0]?.link || ""
  });

  const mapPlaylistToCard = (pl: any) => ({
    id: pl._id || pl.id,
    name: pl.name,
    description: pl.description,
    coverUrl: pl.coverUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    tracks: pl.songs || [],
    createdBy: "You",
    isPublic: pl.isPublic
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "playlists", label: "Playlists" },
    { id: "albums", label: "Albums" },
  ];

  const displayPlaylists = myPlaylists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(mapPlaylistToCard);

  return (
    <div className="p-4 md:p-8 pb-32 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold">Your Library</h1>
          <p className="text-zinc-400 mt-1">Your personal collection across all devices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-2 bg-red-600 hover:bg-red-700 text-white shadow-glow"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </Button>
        </div>
      </motion.div>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {showCreateDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateDialog(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-zinc-900/90 border border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-3xl shadow-2xl backdrop-blur-xl overflow-hidden"
            >
              {/* Background Gradient Blob */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Create Playlist</h3>
                  <Button variant="ghost" size="icon-sm" onClick={() => setShowCreateDialog(false)} className="rounded-full hover:bg-white/10">
                    <Plus className="w-6 h-6 rotate-45" />
                  </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Col: Image Cover */}
                  <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
                    <div className="group relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-800 shadow-xl border border-white/5 transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-white/20">
                      {newPlaylistImage ? (
                        <img src={newPlaylistImage} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-800/50">
                          <Music2 className="w-16 h-16 mb-2 opacity-50" />
                          <span className="text-sm font-medium">No Cover</span>
                        </div>
                      )}

                      {/* Overlay Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                        <label className="cursor-pointer w-full">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="flex items-center justify-center gap-2 w-full py-2 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                            <span className="text-xs">Upload Photo</span>
                          </div>
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRandomImage}
                          className="w-full rounded-full border-white/20 hover:bg-white/10 text-white"
                        >
                          Generate Random
                        </Button>
                        {newPlaylistImage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setNewPlaylistImage("")}
                            className="w-full text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-full"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-center text-zinc-500">
                      Tip: Use a high-quality square image for best results.
                    </p>
                  </div>

                  {/* Right Col: Details */}
                  <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Name</label>
                      <Input
                        placeholder="My Awesome Playlist"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="h-12 bg-white/5 border-white/10 focus:border-white/20 focus:bg-white/10 transition-all text-lg font-medium px-4 rounded-xl placeholder:text-zinc-600"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider ml-1">Description</label>
                      <textarea
                        placeholder="Add an optional description..."
                        value={newPlaylistDesc}
                        onChange={(e) => setNewPlaylistDesc(e.target.value)}
                        className="w-full min-h-[120px] bg-white/5 border border-white/10 focus:border-white/20 focus:bg-white/10 transition-all text-sm px-4 py-3 rounded-xl placeholder:text-zinc-600 resize-none focus:outline-none"
                      />
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => setShowCreateDialog(false)}
                        className="rounded-full px-6 hover:bg-white/5"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePlaylist}
                        disabled={!newPlaylistName.trim()}
                        className="bg-white text-black hover:bg-zinc-200 rounded-full px-8 font-bold shadow-glow-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-500/10">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Liked Songs</p>
            <p className="text-xs text-zinc-500">{likedTracks.length} songs</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10">
            <Disc3 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-semibold text-sm">Playlists</p>
            <p className="text-xs text-zinc-500">{myPlaylists.length} playlists</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 md:relative z-20 py-2">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full pb-1">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "rounded-full border border-transparent",
                  activeFilter === filter.id
                    ? "bg-white text-black hover:bg-white/90"
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border-white/5"
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-white/5 border-white/10 rounded-full text-sm focus:ring-red-500/50"
              />
            </div>
            <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/5">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewMode("grid")}
                className={cn("h-7 w-7 rounded-md", viewMode === "grid" && "bg-white/10 text-white")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setViewMode("list")}
                className={cn("h-7 w-7 rounded-md", viewMode === "list" && "bg-white/10 text-white")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 perspective-1000"
            >
              <TiltCard>
                <PlaylistCard playlist={{
                  id: 'liked-songs',
                  name: 'Liked Songs',
                  description: 'Your favorite tracks',
                  coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop',
                  tracks: likedTracks.map(mapSongToTrack),
                  createdBy: 'You',
                  isPublic: false
                }} index={0} />
              </TiltCard>

              {displayPlaylists.map((playlist, index) => (
                <TiltCard key={playlist.id}>
                  <PlaylistCard playlist={playlist} index={index + 1} />
                </TiltCard>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {displayPlaylists.map((playlist, index) => (
                <div key={playlist.id} className="glass-panel p-2 pr-4 rounded-lg flex items-center gap-4 hover:bg-white/5 transition-colors group cursor-pointer">
                  <img src={playlist.coverUrl} className="w-12 h-12 rounded-md object-cover" alt={playlist.name} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium group-hover:text-red-500 transition-colors">{playlist.name}</h3>
                    <p className="text-xs text-zinc-500">Playlist • {playlist.tracks.length} songs</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Library;