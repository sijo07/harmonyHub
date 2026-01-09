import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

interface EditPlaylistModalProps {
    playlist: any;
    onClose: () => void;
    onUpdate: (updatedPlaylist: any) => void;
}

export const EditPlaylistModal = ({ playlist, onClose, onUpdate }: EditPlaylistModalProps) => {
    const [name, setName] = useState(playlist.name);
    const [description, setDescription] = useState(playlist.description || "");
    const [coverUrl, setCoverUrl] = useState(playlist.coverUrl || "");
    const [isPublic, setIsPublic] = useState(playlist.isPublic || false);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const updated = await api.editPlaylist(playlist._id || playlist.id, {
                name,
                description,
                coverUrl,
                isPublic
            });
            onUpdate(updated);
            onClose();
        } catch (error) {
            console.error("Failed to update playlist", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-white">Edit Playlist</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase">Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-zinc-800 border-zinc-700"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[100px] bg-zinc-800 border border-zinc-700 rounded-md p-3 text-sm text-white resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase">Cover URL</label>
                        <Input
                            value={coverUrl}
                            onChange={(e) => setCoverUrl(e.target.value)}
                            placeholder="https://..."
                            className="bg-zinc-800 border-zinc-700"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                        />
                        <label htmlFor="isPublic" className="text-sm text-zinc-300">Make Public</label>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={loading || !name} className="bg-red-600 hover:bg-red-700 text-white">
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
