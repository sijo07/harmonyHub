import { useState } from "react";
import {
    MoreHorizontal,
    ListPlus,
    Share2,
    PlayCircle,
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
import { usePlayer } from "@/contexts/PlayerContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { toast } from "sonner";
import { Playlist } from "@/types/music";

interface CollectionOptionsMenuProps {
    collection: Playlist | any; // Handling flexibility
    className?: string;
    type?: 'playlist' | 'album';
}

export const CollectionOptionsMenu = ({
    collection,
    className = "",
    type = 'playlist'
}: CollectionOptionsMenuProps) => {
    const { playTrack, queue, addToQueue } = usePlayer();
    const { user, checkUser } = useAuth();

    // Note: addToQueue currently accepts single track. 
    // For collections, we might need to iterate or update context.
    // For now, we will try to add tracks if available.

    const handleAddToQueue = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (collection.tracks && collection.tracks.length > 0) {
            collection.tracks.forEach((track: any) => {
                addToQueue(track);
            });
            toast.success(`Added ${collection.tracks.length} tracks to queue`);
        } else {
            toast.error("No tracks available to add");
        }
    };

    const handlePlayNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        // This is a bit complex without a dedicated context method, 
        // but strictly speaking "Play Next" means inserting after current index.
        // We will skip complex logic for now and just use Queue.
        handleAddToQueue(e);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const link = `${window.location.origin}/${type}/${collection._id || collection.id}`;
        const shareText = `Check out "${collection.name || collection.title}" on Harmony Hub!`;
        navigator.clipboard.writeText(shareText);
        toast.success("Link copied to clipboard");
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this playlist?")) return;
        try {
            await api.deletePlaylist(collection._id || collection.id);
            await checkUser();
            toast.success("Playlist deleted");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete playlist");
        }
    };

    const isOwner = user?.playlists?.some((p: any) => (p._id === collection._id || p.id === collection.id));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className={`${className} data-[state=open]:bg-white/10`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreHorizontal className="w-5 h-5 text-white drop-shadow-md" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-zinc-900/95 backdrop-blur-xl border-white/10 text-zinc-200 z-50">

                <DropdownMenuItem onClick={handleAddToQueue} className="cursor-pointer hover:bg-white/10">
                    <ListPlus className="mr-2 h-4 w-4" />
                    <span>Add to Queue</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem onClick={handleShare} className="cursor-pointer hover:bg-white/10">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share</span>
                </DropdownMenuItem>

                {type === 'playlist' && isOwner && (
                    <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={handleDelete} className="cursor-pointer hover:bg-red-900/30 text-red-500 hover:text-red-400 focus:text-red-400 focus:bg-red-900/30">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete Playlist</span>
                        </DropdownMenuItem>
                    </>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
};
