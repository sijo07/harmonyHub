import { useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Heart, MoreHorizontal, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackCard } from "@/components/TrackCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { useRef, useEffect, useState } from "react";
import { api, convertImage, Song } from "@/services/api";

const AlbumDetails = () => {
    const { id } = useParams();
    const { playPlaylist } = usePlayer();
    const containerRef = useRef(null);
    const { scrollY } = useScroll({ container: containerRef });

    const [album, setAlbum] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!id) return;
            try {
                const res = await api.getAlbumDetails(id);
                // Assuming response structure matches what backend returns for getAlbumDetails
                // Usually { data: { ...album info... } } or just the object
                console.log('Album res:', res);
                setAlbum(res.data || res);
            } catch (error) {
                console.error("Failed to fetch album", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlbum();
    }, [id]);

    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    if (loading) {
        return <div className="p-8 text-center text-zinc-400">Loading album...</div>;
    }

    if (!album) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <div className="text-4xl mb-4">💿</div>
                <p>Album not found</p>
            </div>
        );
    }

    // Normalize data
    const songs = album.songs || []; // Check if 'songs' or 'list' or whatever
    const trackCount = songs.length;
    // Fallback for duration if not present in album object
    const totalDuration = songs.reduce((acc: number, track: any) => acc + (parseInt(track.duration) || 0), 0);

    const formatTotalDuration = () => {
        const hours = Math.floor(totalDuration / 3600);
        const minutes = Math.floor((totalDuration % 3600) / 60);
        return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
    };

    const mapSongToTrack = (song: any) => ({
        id: song.id,
        title: song.name,
        artist: song.primaryArtists || album.primaryArtists || "Unknown Artist",
        album: album.name, // We are in the album
        coverUrl: convertImage(song.image) || convertImage(album.image),
        duration: typeof song.duration === 'string' ? parseInt(song.duration) : song.duration,
        audioUrl: song.previewUrl || song.downloadUrl?.[0]?.link || song.url || "",
        previewUrl: song.previewUrl || song.downloadUrl?.[0]?.link || ""
    });

    const tracks = songs.map(mapSongToTrack);
    const albumCover = convertImage(album.image);

    return (
        <div className="pb-32 -mt-6">
            {/* Immersive Background */}
            <div className="fixed inset-0 top-0 h-[500px] z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-black" />
                <img src={albumCover} className="w-full h-full object-cover opacity-20 blur-3xl saturate-0" alt="" />
            </div>

            <div className="relative z-10">
                {/* Header content */}
                <div className="h-[340px] md:h-[400px] flex items-end p-8 max-w-7xl mx-auto">
                    <motion.div
                        style={{ opacity }}
                        className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full"
                    >
                        <img
                            src={albumCover}
                            alt={album.name}
                            className="w-48 h-48 md:w-60 md:h-60 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover ring-1 ring-white/10"
                        />
                        <div className="text-center md:text-left flex-1">
                            <p className="text-xs font-bold tracking-widest uppercase text-white/70 mb-2">Album</p>
                            <h1 className="text-4xl md:text-7xl font-bold mb-4 text-white drop-shadow-md">{album.name}</h1>
                            <p className="text-white/60 text-lg mb-4 line-clamp-2 max-w-2xl">{album.description}</p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/80 font-medium">
                                <span className="text-white">{album.primaryArtists}</span>
                                <span>•</span>
                                <span>{album.year || '2024'}</span>
                                <span>•</span>
                                <span>{trackCount} songs, {formatTotalDuration()}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Bar & List */}
                <div className="bg-black/20 backdrop-blur-xl min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">

                        {/* Actions */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <Button
                                    className="w-14 h-14 rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-glow-white flex items-center justify-center"
                                    onClick={() => playPlaylist(tracks)}
                                >
                                    <Play className="w-7 h-7 ml-1 fill-current" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                    <Heart className="w-7 h-7" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                    <MoreHorizontal className="w-7 h-7" />
                                </Button>
                            </div>
                        </div>

                        {/* Track List */}
                        <div className="space-y-1">
                            {/* Header Row */}
                            <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_2fr_1fr_auto] gap-4 px-4 py-2 text-sm font-medium text-zinc-500 border-b border-white/5 mb-4 uppercase tracking-widest">
                                <span className="w-8 text-center">#</span>
                                <span>Title</span>
                                <span className="hidden md:block">Artist</span>
                                <div className="flex justify-end mr-4"><Clock className="w-4 h-4" /></div>
                            </div>

                            {tracks.map((track, index) => (
                                <div key={track.id} className="group rounded-xl transition-colors hover:bg-white/5">
                                    <TrackCard track={track} index={index} showAlbum={false} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumDetails;
