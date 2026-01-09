import { useParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, Heart, MoreHorizontal, Clock, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackCard } from "@/components/TrackCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { useRef, useEffect, useState } from "react";
import { api, convertImage, Song } from "@/services/api";

const ArtistDetails = () => {
    const { id } = useParams();
    const { playPlaylist } = usePlayer();
    const containerRef = useRef(null);
    const { scrollY } = useScroll({ container: containerRef });

    const [artist, setArtist] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArtist = async () => {
            if (!id) return;
            try {
                const res = await api.getArtistDetails(id);
                console.log('Artist res:', res);
                setArtist(res.data || res);
            } catch (error) {
                console.error("Failed to fetch artist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtist();
    }, [id]);

    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    if (loading) {
        return <div className="p-8 text-center text-zinc-400">Loading artist...</div>;
    }

    if (!artist) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <div className="text-4xl mb-4">🎤</div>
                <p>Artist not found</p>
            </div>
        );
    }

    const songs = artist.topSongs || artist.songs || [];
    const artistImage = convertImage(artist.image);

    const mapSongToTrack = (song: any) => ({
        id: song.id,
        title: song.name,
        artist: artist.name,
        album: song.album?.name || "Single",
        coverUrl: convertImage(song.image) || artistImage,
        duration: typeof song.duration === 'string' ? parseInt(song.duration) : song.duration,
        audioUrl: song.previewUrl || song.downloadUrl?.[0]?.link || "",
        previewUrl: song.previewUrl || song.downloadUrl?.[0]?.link || ""
    });

    const tracks = songs.map(mapSongToTrack);

    return (
        <div className="pb-32 -mt-6">
            {/* Immersive Background */}
            <div className="fixed inset-0 top-0 h-[500px] z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />
                <img src={artistImage} className="w-full h-full object-cover opacity-20 blur-3xl" alt="" />
            </div>

            <div className="relative z-10">
                {/* Header content */}
                <div className="h-[340px] md:h-[400px] flex items-end p-8 max-w-7xl mx-auto">
                    <motion.div
                        style={{ opacity }}
                        className="flex flex-col md:flex-row items-center md:items-end gap-8 w-full"
                    >
                        <img
                            src={artistImage}
                            alt={artist.name}
                            className="w-48 h-48 md:w-60 md:h-60 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover ring-4 ring-white/10"
                        />
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Verified className="w-5 h-5 text-blue-400" />
                                <p className="text-xs font-bold tracking-widest uppercase text-white/70">Verified Artist</p>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-bold mb-4 text-white drop-shadow-md">{artist.name}</h1>
                            <p className="text-white/60 text-lg mb-4 line-clamp-2 max-w-2xl">{artist.followerCount ? `${parseInt(artist.followerCount).toLocaleString()} Followers` : 'Popular Artist'}</p>
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
                                    className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-400 text-black hover:scale-105 transition-all shadow-glow flex items-center justify-center"
                                    onClick={() => playPlaylist(tracks)}
                                >
                                    <Play className="w-7 h-7 ml-1 fill-current" />
                                </Button>
                                <Button variant="outline" className="rounded-full px-8 border-white/20 hover:bg-white/10 text-white">
                                    Follow
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                                    <MoreHorizontal className="w-7 h-7" />
                                </Button>
                            </div>
                        </div>

                        {/* Track List */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-4">Popular Songs</h2>

                            <div className="space-y-1">
                                {tracks.map((track, index) => (
                                    <div key={track.id} className="group rounded-xl transition-colors hover:bg-white/5">
                                        <TrackCard track={track} index={index} showAlbum />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistDetails;
