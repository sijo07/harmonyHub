import { useParams, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Play, Shuffle, Heart, MoreHorizontal, Clock, Search, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackCard } from "@/components/TrackCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRef, useEffect, useState } from "react";
import { api, convertImage, Song } from "@/services/api";
import { Playlist } from "@/types/music";
import { EditPlaylistModal } from "@/components/EditPlaylistModal";

const PlaylistPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPlaylist } = usePlayer();
  const { user } = useAuth();
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ container: containerRef });

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!id) return;
      if (id === 'liked-songs') {
        navigate('/liked');
        return;
      }

      try {
        const res = await api.getPlaylistDetails(id);
        if (res.data) {
          setPlaylist(res.data);
        } else if (res && (res._id || res.id)) {
          setPlaylist(res);
        }
      } catch (error) {
        console.error("Failed to fetch playlist", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id, navigate]);

  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const handleDeletePlaylist = async () => {
    if (!playlist || !confirm("Are you sure you want to delete this playlist? This cannot be undone.")) return;
    try {
      if (playlist._id || playlist.id) {
        await api.deletePlaylist(playlist._id || playlist.id);
        navigate('/library');
      }
    } catch (error) {
      console.error("Failed to delete playlist", error);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!playlist) return;
    try {
      const plId = playlist._id || playlist.id;
      if (plId) {
        await api.removeSongFromPlaylist(plId, songId);
        // Update local state
        const updatedSongs = (playlist.tracks || playlist.songs || []).filter((s: any) => (s.id || s._id) !== songId);
        setPlaylist({ ...playlist, tracks: updatedSongs, songs: updatedSongs });
      }
    } catch (error) {
      console.error("Failed to remove song", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading playlist...</div>;
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500">
        <div className="text-4xl mb-4">😕</div>
        <p>Playlist not found</p>
      </div>
    );
  }

  const songs = playlist.tracks || playlist.songs || [];
  const trackCount = songs.length;
  // Check ownership: handle populated user object or string ID
  const isOwner = user && playlist.user && (
    (typeof playlist.user === 'string' && playlist.user === user._id) ||
    (typeof playlist.user === 'object' && (playlist.user as any)._id === user._id)
  );

  const totalDuration = songs.reduce((acc, track) => acc + (track.duration || 0), 0);
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  const mapSongToTrack = (song: Song) => ({
    id: song.id,
    title: song.name || song.title,
    artist: typeof song.artist === 'string' ? song.artist : (song.artists?.primary?.[0]?.name || "Unknown Artist"),
    album: song.album?.name || "Unknown Album",
    coverUrl: song.coverUrl || convertImage(song.image),
    duration: typeof song.duration === 'string' ? parseInt(song.duration) : song.duration,
    audioUrl: song.previewUrl || song.downloadUrl?.[0]?.link || ""
  });

  const tracks = songs.map(mapSongToTrack);
  const playlistCover = playlist.coverUrl || "";

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pb-32 -mt-6 min-h-screen relative overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 top-0 h-[60vh] z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/10 via-black to-black" />
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5 }}
          src={playlistCover}
          className="w-full h-full object-cover blur-[100px] scale-110 saturate-150"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      <div className="relative z-10">
        <div className="min-h-[40vh] flex items-end p-8 max-w-7xl mx-auto pt-24 pb-12">
          <motion.div
            style={{ opacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full"
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={playlistCover}
                alt={playlist.name}
                className="w-52 h-52 md:w-64 md:h-64 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover ring-1 ring-white/10"
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
            </motion.div>

            <div className="text-center md:text-left flex-1 space-y-4">
              <p className="text-xs font-bold tracking-widest uppercase text-white/70">Playlist</p>
              <h1 className="text-4xl md:text-7xl font-bold text-white drop-shadow-md tracking-tight leading-tight">{playlist.name}</h1>
              <p className="text-white/60 text-lg line-clamp-2 max-w-2xl font-light">{playlist.description}</p>

              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-white/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {playlist.createdBy?.[0] || 'H'}
                  </div>
                  <span className="text-white hover:underline cursor-pointer">{playlist.createdBy || 'Harmony Hub'}</span>
                </div>
                <span className="text-white/50">•</span>
                <span className="text-white/80 text-sm">{trackCount} songs</span>
                <span className="text-white/50">•</span>
                <span className="text-white/80 text-sm">{formatTotalDuration()}</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="bg-black/40 backdrop-blur-2xl min-h-screen relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
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
                    <Heart className="w-7 h-7" />
                  </Button>
                  <Button variant="ghost" size="icon-lg" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full">
                    <MoreHorizontal className="w-7 h-7" />
                  </Button>
                </div>
              </div>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
                    onClick={() => setShowEditModal(true)}
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-red-900/30 bg-red-900/10 hover:bg-red-900/30 text-red-500 hover:text-red-400"
                    onClick={handleDeletePlaylist}
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <motion.div
              className="space-y-1"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_2fr_1fr_auto] gap-4 px-4 py-3 text-xs font-semibold text-zinc-400 border-b border-white/5 mb-4 uppercase tracking-widest sticky top-0 z-10 bg-black/60 backdrop-blur-xl shadow-lg -mx-4 md:mx-0 rounded-lg transition-all">
                <span className="w-8 text-center">#</span>
                <span>Title</span>
                <span className="hidden md:block">Album</span>
                <div className="flex justify-end mr-4"><Clock className="w-4 h-4" /></div>
              </div>

              {tracks.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                  <p className="text-lg mb-2">This playlist is empty</p>
                  <p className="text-sm">Find some songs and add them here!</p>
                </div>
              ) : (
                tracks.map((track, index) => (
                  <motion.div key={track.id + index} variants={itemVariants} className="group rounded-xl transition-colors hover:bg-white/5">
                    <TrackCard
                      track={track}
                      index={index}
                      showAlbum
                      canRemove={isOwner}
                      onRemove={() => handleRemoveSong(track.id)}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showEditModal && playlist && (
          <EditPlaylistModal
            playlist={playlist}
            onClose={() => setShowEditModal(false)}
            onUpdate={(updated) => {
              setPlaylist(updated);
              // Optionally verify ownership again if user changed? Unlikely
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaylistPage;
