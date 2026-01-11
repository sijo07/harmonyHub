import { useState } from "react";
import {
    MoreHorizontal,
    PlusCircle,
    ListPlus,
    Share2,
    Heart,
    Disc,
    Mic2,
    Trash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { AddToPlaylistModal } from "@/components/AddToPlaylistModal";
import { usePlayer } from "@/contexts/PlayerContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { toast } from "sonner"; // Assuming sonner is used, or console fallback
import { useNavigate } from "react-router-dom";

interface SongOptionsMenuProps {
    song: any; // Using any for flexibility across different song objects
    className?: string;
    showAlbumOption?: boolean;
    showArtistOption?: boolean;
    variant?: "ghost" | "default";
    onRemove?: () => void;
}

export const SongOptionsMenu = ({
    song,
    className = "",
    showAlbumOption = true,
    showArtistOption = true,
    variant = "ghost",
    onRemove
}: SongOptionsMenuProps) => {
    const { addToQueue } = usePlayer();
    const { user, checkUser } = useAuth();
    const navigate = useNavigate();

    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [isLiked, setIsLiked] = useState(() => {
        if (user?.likedSongs) {
            return user.likedSongs.some((s: any) => s.id == song.id);
        }
        return false;
    });

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isLiked) {
                await api.removeFromFavorites(song.id);
                setIsLiked(false);
                // toast.success("Removed from Liked Songs");
            } else {
                await api.addToFavorites(song);
                setIsLiked(true);
                // toast.success("Added to Liked Songs");
            }
            checkUser(); // Sync global state
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const handleAddToQueue = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToQueue(song);
        // toast.success("Added to Queue");
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = `${window.location.origin}/song/${song.id}`; // Assuming we have song routes or just share title
        const shareText = `Check out "${song.title}" by ${song.artist || song.subtitle} on Harmony Hub!`;
        navigator.clipboard.writeText(shareText);
        // toast.success("Copied to clipboard");
        alert("Song info copied to clipboard!");
    };

    if (!song) return null;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className={`${className} data-[state=open]:bg-white/10`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreHorizontal className="w-4 h-4 text-zinc-400 hover:text-white" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-900/95 backdrop-blur-xl border-white/10 text-zinc-200 z-50">

                    <DropdownMenuItem onClick={handleLike} className="cursor-pointer hover:bg-white/10">
                        <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span>{isLiked ? "Remove from Liked" : "Save to Liked Songs"}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        setShowPlaylistModal(true);
                    }} className="cursor-pointer hover:bg-white/10">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>Add to Playlist</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleAddToQueue} className="cursor-pointer hover:bg-white/10">
                        <ListPlus className="mr-2 h-4 w-4" />
                        <span>Add to Queue</span>
                    </DropdownMenuItem>

                    {onRemove && (
                        <>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }} className="cursor-pointer hover:bg-white/10 text-red-500 hover:text-red-400 focus:text-red-400">
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Remove from Playlist</span>
                            </DropdownMenuItem>
                        </>
                    )}

                    <DropdownMenuSeparator className="bg-white/10" />

                    {showArtistOption && (
                        <DropdownMenuItem onClick={() => navigate(`/artist/${song.primaryArtistsId || ''}`)} className="cursor-pointer hover:bg-white/10">
                            <Mic2 className="mr-2 h-4 w-4" />
                            <span>Go to Artist</span>
                        </DropdownMenuItem>
                    )}

                    {showAlbumOption && (
                        <DropdownMenuItem onClick={() => navigate(`/album/${song.albumId || ''}`)} className="cursor-pointer hover:bg-white/10">
                            <Disc className="mr-2 h-4 w-4" />
                            <span>Go to Album</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem onClick={handleShare} className="cursor-pointer hover:bg-white/10">
                        <Share2 className="mr-2 h-4 w-4" />
                        <span>Share</span>
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            {showPlaylistModal && (
                <AddToPlaylistModal
                    song={song}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </>
    );
};
