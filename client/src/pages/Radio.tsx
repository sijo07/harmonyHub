import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PlaylistCard } from '../components/PlaylistCard';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Radio as RadioIcon, Globe, Music2 } from 'lucide-react';

const Radio = () => {
    const [activeTab, setActiveTab] = useState<'charts' | 'live'>('live');
    const [charts, setCharts] = useState<any[]>([]);
    const [liveStations, setLiveStations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [liveFilter, setLiveFilter] = useState('classical'); // Default tag

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Saavn Charts
                const saavnRes = await api.getRadioStations();
                if (saavnRes && saavnRes.data) {
                    setCharts(saavnRes.data.charts || []);
                }

                // Fetch Live Radio
                const liveRes = await api.getLiveStations(30, liveFilter);
                if (liveRes && liveRes.data) {
                    setLiveStations(liveRes.data);
                }

            } catch (error) {
                console.error("Failed to fetch radio data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [liveFilter]);

    const mapToPlaylist = (item: any) => ({
        _id: item.id,
        id: item.id,
        name: item.name || item.title,
        description: item.subtitle || item.country || 'Radio Station',
        coverUrl: item.image || item.coverUrl || '/img/bg-img/a1.jpg', // Fallback image
        tracks: [
            {
                id: item.id,
                title: item.name || item.title,
                artist: item.subtitle || "Live Radio",
                coverUrl: item.image || '/img/bg-img/a1.jpg',
                previewUrl: item.url, // Stream URL
                audioUrl: item.url,
                duration: "Live",
                album: { name: "Radio" }
            }
        ],
        user: { name: 'System' },
        isPublic: true,
        type: item.type
    });

    const tags = ['classical', 'jazz', 'pop', 'rock', 'news', 'india', 'uk', 'usa'];

    return (
        <div className="p-6 text-white pb-24 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Live Radio
                    </h1>
                    <p className="text-gray-400 mt-2">Tune in to the world's beat</p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('live')}
                        className={cn("gap-2", activeTab === 'live' && "bg-white/10 text-white")}
                    >
                        <Globe className="w-4 h-4" /> Global Stations
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab('charts')}
                        className={cn("gap-2", activeTab === 'charts' && "bg-white/10 text-white")}
                    >
                        <Music2 className="w-4 h-4" /> Top Charts
                    </Button>
                </div>
            </div>

            {loading && <div className="text-center py-20 text-gray-500 animate-pulse">Scanning frequencies...</div>}

            {!loading && activeTab === 'charts' && (
                <div className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {charts.map((station) => (
                            <PlaylistCard key={station.id} playlist={mapToPlaylist(station) as any} />
                        ))}
                    </div>
                    {charts.length === 0 && <p className="text-center text-gray-500 mt-10">No charts available.</p>}
                </div>
            )}

            {!loading && activeTab === 'live' && (
                <div className="animate-in fade-in duration-500">
                    {/* Tags Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setLiveFilter(tag)}
                                className={cn(
                                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all border border-white/10",
                                    liveFilter === tag
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                #{tag}
                            </button>
                        ))}
                        <button
                            onClick={() => setLiveFilter('')}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-all border border-white/10",
                                liveFilter === ''
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            Top Clicked
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {liveStations.map((station) => (
                            <PlaylistCard key={station.id} playlist={mapToPlaylist(station) as any} />
                        ))}
                    </div>
                    {liveStations.length === 0 && <p className="text-center text-gray-500 mt-10">No stations found.</p>}
                </div>
            )}
        </div>
    );
};

export default Radio;
