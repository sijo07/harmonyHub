import { motion } from "framer-motion";
import { usePlayer } from "@/contexts/PlayerContext";
import { X, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const QueueSidebar = () => {
    const { queue, currentTrack, playTrack, isQueueOpen, toggleQueue } = usePlayer();

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: isQueueOpen ? 0 : "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 right-0 h-full w-96 bg-card border-l border-border z-50 flex flex-col shadow-2xl"
        >
            <div className="p-6 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md">
                <h2 className="text-xl font-bold">Play Queue</h2>
                <Button variant="ghost" size="icon-sm" onClick={toggleQueue}>
                    <X className="w-5 h-5" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-2">
                    {queue.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">
                            <p>Queue is empty</p>
                            <p className="text-sm">Add songs to start listening</p>
                        </div>
                    ) : (
                        queue.map((track, index) => {
                            const isCurrent = currentTrack?.id === track.id;

                            return (
                                <div
                                    key={`${track.id}-${index}`}
                                    className={cn(
                                        "group flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent",
                                        isCurrent && "bg-white/5 border-primary/20"
                                    )}
                                    onClick={() => playTrack(track)}
                                >
                                    <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                        <img
                                            src={track.coverUrl}
                                            alt={track.title}
                                            className={cn("w-full h-full object-cover", isCurrent && "opacity-50")}
                                        />
                                        {isCurrent && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="w-6 h-6 text-white" />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={cn("font-medium truncate", isCurrent ? "text-primary" : "text-foreground")}>
                                            {track.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {track.artist}
                                        </p>
                                    </div>

                                    <span className="text-xs text-muted-foreground font-mono">
                                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </motion.div>
    );
};
