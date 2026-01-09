import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Music, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Song } from "@/services/api";

interface AddToPlaylistModalProps {
    song: Song | null;
    onClose: () => void;
}

export const AddToPlaylistModal = ({ song, onClose }: AddToPlaylistModalProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!song) return null;

    const userPlaylists = user?.playlists || [];

    const handleAddToPlaylist = async (playlistId: string) => {
        setLoading(playlistId);
        try {
            await api.addSongToPlaylist(playlistId, song);
            setSuccess(playlistId);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            console.error("Failed to add to playlist", error);
            setLoading(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Add to Playlist</h3>
                    <Button variant="ghost" size="icon-sm" onClick={onClose} className="rounded-full hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Generic Song Preview */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center flex-shrink-0">
                        {/* Try to use coverUrl or fallback */}
                        {(song as any).coverUrl || (song as any).image ? (
                            <img src={(song as any).coverUrl || api.convertImage((song as any).image)} alt="cover" className="w-full h-full object-cover rounded" />
                        ) : (
                            <Music className="w-5 h-5 text-zinc-500" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium truncate text-white">{song.title || (song as any).name}</p>
                        <p className="text-xs text-zinc-400 truncate">{song.artist || (song as any).artists?.primary?.[0]?.name}</p>
                    </div>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {userPlaylists.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500">
                            <p>No playlists found.</p>
                            <p className="text-xs mt-1">Create one in your library first!</p>
                        </div>
                    ) : (
                        userPlaylists.map((playlist: any) => (
                            <button
                                key={playlist._id || playlist.id}
                                onClick={() => handleAddToPlaylist(playlist._id || playlist.id)}
                                disabled={!!loading || !!success}
                                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center overflow-hidden">
                                        {playlist.coverUrl ? (
                                            <img src={playlist.coverUrl} className="w-full h-full object-cover" alt={playlist.name} />
                                        ) : (
                                            <Music className="w-5 h-5 text-zinc-600" />
                                        )}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-sm group-hover:text-white transition-colors">{playlist.name}</p>
                                        <p className="text-xs text-zinc-500">{playlist.songs?.length || 0} songs</p>
                                    </div>
                                </div>

                                {loading === (playlist._id || playlist.id) && (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                )}
                                {success === (playlist._id || playlist.id) && (
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-black" />
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
};
