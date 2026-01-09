import { motion } from "framer-motion";
import { Heart, Clock, Play, Shuffle } from "lucide-react";
import { TrackCard } from "@/components/TrackCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { convertImage } from "@/services/api";

const LikedSongs = () => {
  const { user } = useAuth();
  const { playPlaylist } = usePlayer();
  const likedTracks = user?.likedSongs || [];

  const mapSongToTrack = (song: any) => ({
    id: song.id || song._id,
    title: song.name || song.title,
    artist: song.artists?.primary?.[0]?.name || song.artist || "Unknown Artist",
    album: song.album?.name || song.album || "Unknown Album",
    coverUrl: typeof song.image === 'string' ? song.image : convertImage(song.image),
    duration: parseInt(song.duration) || 0,
    previewUrl: song.audioUrl || song.previewUrl || song.downloadUrl?.[song.downloadUrl.length - 1]?.link || ""
  });

  const tracks = likedTracks.map(mapSongToTrack);

  // Stagger animation for list
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Featured image for Liked Songs (can be dynamic or static)
  const coverImage = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80";

  return (
    <div className="pb-32 -mt-6 min-h-screen relative overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 top-0 h-[60vh] z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5 }}
          src={coverImage}
          className="w-full h-full object-cover blur-[100px] scale-110 saturate-150"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      <div className="relative z-10">
        {/* Header content */}
        <div className="min-h-[40vh] flex items-end p-8 max-w-7xl mx-auto pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full"
          >
            <motion.div
              className="relative group w-52 h-52 md:w-64 md:h-64 shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-white w-full h-full rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-[0_20px_50px_rgba(220,38,38,0.3)] ring-1 ring-white/10">
                <Heart className="w-24 h-24 fill-white drop-shadow-md" />
              </div>
            </motion.div>

            <div className="text-center md:text-left flex-1 space-y-4">
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">Playlist</p>
              <h1 className="text-5xl md:text-8xl font-bold text-white drop-shadow-md tracking-tight leading-tight">Liked Songs</h1>

              <div className="flex items-center justify-center md:justify-start gap-3 text-sm text-white/80 font-medium mt-6">
                <div className="flex items-center gap-2">
                  <img src={user?.avatar || "https://github.com/shadcn.png"} className="w-6 h-6 rounded-full border border-white/20" alt="User" />
                  <span className="text-white hover:underline cursor-pointer">{user?.name || "User"}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{tracks.length} songs</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Bar & List */}
        <div className="bg-black/40 backdrop-blur-2xl min-h-screen relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">

            {/* Actions */}
            <div className="flex items-center gap-6 mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="w-14 h-14 rounded-full bg-[#FF0000] hover:bg-red-600 text-white shadow-[0_0_20px_rgba(255,0,0,0.4)] flex items-center justify-center p-0"
                  onClick={() => playPlaylist(tracks)}
                >
                  <Play className="w-6 h-6 ml-1 fill-current" />
                </Button>
              </motion.div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon-lg" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                  <Shuffle className="w-7 h-7" />
                </Button>
              </div>
            </div>

            {/* Track List */}
            <motion.div
              className="space-y-1"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Header Row */}
              <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_2fr_1fr_auto] gap-4 px-4 py-3 text-xs font-semibold text-zinc-500 border-b border-white/5 mb-4 uppercase tracking-widest sticky top-0 z-10 bg-black/90 backdrop-blur-md -mx-4 md:mx-0 rounded-lg">
                <span className="w-8 text-center">#</span>
                <span>Title</span>
                <span className="hidden md:block">Album</span>
                <div className="flex justify-end mr-4"><Clock className="w-4 h-4" /></div>
              </div>

              {tracks.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                  <Heart className="w-16 h-16 mx-auto mb-4 text-zinc-700" />
                  <p className="text-lg mb-2">No liked songs yet</p>
                  <p className="text-sm">Tap the heart icon on any song to save it here!</p>
                </div>
              ) : (
                tracks.map((track, index) => (
                  <motion.div key={track.id} variants={itemVariants} className="group rounded-xl transition-colors hover:bg-white/5">
                    <TrackCard track={track} index={index} showAlbum />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;
