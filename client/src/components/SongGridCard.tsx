import { motion } from "framer-motion";
import { Disc3, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { convertImage, Song } from "@/services/api";
import { SongOptionsMenu } from "@/components/SongOptionsMenu";
import { usePlayer } from "@/contexts/PlayerContext";

interface SongGridCardProps {
    song: Song;
    playlist: Song[];
    onClick: () => void;
}

export const SongGridCard = ({ song, playlist, onClick }: SongGridCardProps) => {
    const { currentTrack, isPlaying } = usePlayer();

    const isCurrentSong = currentTrack?.id === song.id;
    const isSongPlaying = isCurrentSong && isPlaying;

    const mapSongToTrack = (s: Song) => ({
        id: s.id,
        title: s.name,
        artist: s.artists.primary[0]?.name || "Unknown",
        album: s.album?.name || "Unknown",
        coverUrl: convertImage(s.image),
        duration: parseInt(s.duration) || 0,
        audioUrl: s.previewUrl || s.downloadUrl?.[0]?.link || "",
        previewUrl: s.previewUrl || s.downloadUrl?.[0]?.link || ""
    });

    return (
        <div className="glass-card p-3 rounded-2xl cursor-pointer group relative hover:shadow-[0_0_30px_rgba(255,51,153,0.15)] bg-black/20">
            <div
                className="relative aspect-square mb-3 overflow-hidden rounded-xl border border-white/5 group-hover:border-white/10 transition-colors"
                onClick={onClick}
            >
                <img
                    src={convertImage(song.image)}
                    alt={song.name}
                    className="object-cover w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Play Overlay */}
                <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] ${isSongPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all duration-300 flex items-center justify-center`}>
                    <Button size="icon" className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_var(--neon-pink)] hover:scale-110 transition-all">
                        {isSongPlaying ? (
                            <div className="flex gap-1 h-4 items-end">
                                <motion.div animate={{ height: ["40%", "100%", "40%"] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-1 bg-white rounded-full" />
                                <motion.div animate={{ height: ["100%", "40%", "100%"] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className="w-1 bg-white rounded-full" />
                                <motion.div animate={{ height: ["40%", "80%", "40%"] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                            </div>
                        ) : (
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                        )}
                    </Button>
                </div>

                {/* Options Menu (Top Right) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <SongOptionsMenu
                        song={mapSongToTrack(song)}
                        className="hover:bg-black/60 bg-black/20 backdrop-blur-md text-white border border-white/10"
                    />
                </div>

                {/* Decorative neon line on hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-1.5 px-0.5">
                <h3 className="font-semibold truncate text-white group-hover:text-primary transition-colors text-glow">{song.name}</h3>
                <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors">{song.artists.primary[0]?.name}</p>
            </div>
        </div>
    );
};
