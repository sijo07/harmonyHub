import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { Play, Heart, Share2, MoreHorizontal, Disc, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaylistCard } from '../components/PlaylistCard';
import { usePlayer } from '@/contexts/PlayerContext';

const NewReleases = () => {
    const [data, setData] = useState<any>({ newTrending: [], newAlbums: [], topPlaylists: [] });
    const [loading, setLoading] = useState(true);
    const { playTrack } = usePlayer();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getNewReleases();
                if (res && res.data) {
                    setData(res.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const heroItem = data.newTrending[0];

    const mapToPlaylist = (item: any) => ({
        _id: item.id,
        id: item.id,
        name: item.title || item.name,
        description: item.subtitle || item.artist || item.type,
        coverUrl: item.image || item.coverUrl,
        tracks: [],
        user: { name: 'System' },
        isPublic: true,
        type: item.type
    });

    if (loading) return <div className="text-white p-10 flex justify-center">Loading New Releases...</div>;

    return (
        <div className="text-white pb-24 min-h-screen relative overflow-hidden">
            {/* Background Blur */}
            {heroItem && (
                <div
                    className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 z-0 pointer-events-none"
                    style={{ backgroundImage: `url(${heroItem.coverUrl})` }}
                />
            )}

            {/* Hero Section */}
            {heroItem && (
                <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-end gap-8 min-h-[50vh] bg-gradient-to-b from-transparent to-black/80">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        src={heroItem.coverUrl}
                        alt={heroItem.title}
                        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="flex-1 mb-4 space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                Trending Now
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-2 leading-tight">
                                {heroItem.title}
                            </h1>
                            <p className="text-xl text-gray-300 flex items-center gap-2">
                                <Disc className="w-5 h-5" /> {heroItem.artist} • {heroItem.type}
                            </p>
                        </motion.div>

                        <div className="flex items-center gap-4 pt-4">
                            <Button
                                size="lg"
                                className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 h-14 text-lg shadow-glow"
                                onClick={() => playTrack(heroItem)}
                            >
                                <Play className="w-6 h-6 mr-2 fill-current" /> Play Now
                            </Button>
                            <Button size="icon" variant="secondary" className="rounded-full h-12 w-12 bg-white/10 hover:bg-white/20 text-white">
                                <Heart className="w-5 h-5" />
                            </Button>
                            <Button size="icon" variant="ghost" className="rounded-full h-12 w-12 text-white/70 hover:text-white">
                                <MoreHorizontal className="w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Sections */}
            <div className="relative z-10 px-6 py-8 space-y-12">

                {data.newAlbums.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-primary" /> New Albums
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {data.newAlbums.map((item: any) => (
                                <PlaylistCard key={item.id} playlist={mapToPlaylist(item)} isNew={true} />
                            ))}
                        </div>
                    </section>
                )}

                {data.topPlaylists.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Top Playlists</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {data.topPlaylists.map((item: any) => (
                                <PlaylistCard key={item.id} playlist={mapToPlaylist(item)} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default NewReleases;
