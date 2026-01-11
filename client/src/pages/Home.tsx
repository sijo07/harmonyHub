import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Sparkles, Disc3, Flame, Activity, Play } from "lucide-react";
import { FeaturedHero } from "@/components/FeaturedHero";
import { Button } from "@/components/ui/button";
import { api, convertImage, Song } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { SongGridCard } from "@/components/SongGridCard";
import { TrackCard } from "@/components/TrackCard";
import { LiveVisualizer } from "@/components/LiveVisualizer";
import { PlaylistCard } from "@/components/PlaylistCard";

const data = [
  { name: "Mon", minutes: 45 },
  { name: "Tue", minutes: 120 },
  { name: "Wed", minutes: 90 },
  { name: "Thu", minutes: 160 },
  { name: "Fri", minutes: 210 },
  { name: "Sat", minutes: 180 },
  { name: "Sun", minutes: 140 },
];

const Home = () => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [hindiSongs, setHindiSongs] = useState<Song[]>([]);
  const [englishSongs, setEnglishSongs] = useState<Song[]>([]);
  const [tamilSongs, setTamilSongs] = useState<Song[]>([]);
  const [malayalamSongs, setMalayalamSongs] = useState<Song[]>([]);
  const [globalSongs, setGlobalSongs] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [featuredSong, setFeaturedSong] = useState<Song | null>(null);

  // Mock playlists for Futuristic Section
  const futuristicPlaylists = [
    { _id: 'neo-tokyo', id: 'neo-tokyo', name: "Neo Tokyo Nights", description: "Cyberpunk synthwave for night drives.", coverUrl: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=2070&auto=format&fit=crop", tracks: [], isPublic: true, createdBy: "System" },
    { _id: 'cyber-city', id: 'cyber-city', name: "Cyber City Vibes", description: "Deep bass and neon lights.", coverUrl: "https://images.unsplash.com/photo-1605218427306-6354db69e563?q=80&w=1972&auto=format&fit=crop", tracks: [], isPublic: true, createdBy: "System" },
    { _id: 'digital-dreams', id: 'digital-dreams', name: "Digital Dreams", description: "Ethereal sounds from the mainframe.", coverUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop", tracks: [], isPublic: true, createdBy: "System" },
    { _id: 'glitch-core', id: 'glitch-core', name: "Glitch Core", description: "Experimental beats and distorted reality.", coverUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", tracks: [], isPublic: true, createdBy: "System" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hindiRes, englishRes, tamilRes, malRes, globalRes, newReleasesRes, artistsRes] = await Promise.all([
          api.getHindiHits(),
          api.getEnglishHits(),
          api.getTamilHits(),
          api.getMalayalamHits(),
          api.searchSongs("Global Top 50"),
          api.getNewReleases(),
          api.getFeaturedArtists()
        ]);

        if (Array.isArray(hindiRes)) setHindiSongs(hindiRes.slice(0, 10));
        if (Array.isArray(englishRes)) {
          setEnglishSongs(englishRes.slice(0, 10));
          // Set featured song from English hits if available
          if (englishRes.length > 0) setFeaturedSong(englishRes[0]);
        }
        if (Array.isArray(tamilRes)) setTamilSongs(tamilRes.slice(0, 10));
        if (Array.isArray(malRes)) setMalayalamSongs(malRes.slice(0, 10));
        // Global Songs
        if (Array.isArray(globalRes.data?.results)) setGlobalSongs(globalRes.data.results.slice(0, 6));

        // Trending Songs (New Releases)
        if (newReleasesRes && newReleasesRes.data && Array.isArray(newReleasesRes.data.newTrending)) {
          setTrendingSongs(newReleasesRes.data.newTrending.slice(0, 10));
        }

        // Top Artists
        if (Array.isArray(artistsRes)) setTopArtists(artistsRes);


      } catch (error) {
        console.error("Failed to fetch home data", error);
      }
    };
    fetchData();
  }, []);

  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const mapSongToTrack = (song: Song) => ({
    id: song.id,
    title: song.name,
    artist: song.artists.primary[0]?.name || "Unknown Artist",
    album: song.album.name,
    coverUrl: convertImage(song.image),
    duration: parseInt(song.duration) || 0,
    audioUrl: song.previewUrl || song.downloadUrl?.[0]?.link || "",
    previewUrl: song.previewUrl || song.downloadUrl?.[0]?.link || ""
  });

  const handlePlaySong = (song: Song, playlist: Song[]) => {
    const track = mapSongToTrack(song);
    playTrack(track); // Pass single track for now
  };

  const SectionRow = ({ title, songs, icon: Icon, colorClass }: { title: string, songs: any[], icon: any, colorClass: string }) => (
    <section className="relative">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10 px-2 md:px-0">
        <div className={`p-2.5 ${colorClass.replace("text-", "bg-")}/10 rounded-xl backdrop-blur-md border border-white/5`}>
          <Icon className={`w-5 h-5 ${colorClass} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">{title}</h2>
      </div>

      {/* Scrollable Container */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 px-4 md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
        {songs.length > 0 ? songs.map((song) => (
          <div key={song.id} className="min-w-[160px] md:min-w-0 snap-center mr-4 md:mr-0">
            <SongGridCard
              song={song}
              playlist={songs}
              onClick={() => handlePlaySong(song, songs)}
            />
          </div>
        )) : <div className="col-span-full h-32 flex items-center justify-center text-zinc-500 bg-white/5 rounded-2xl animate-pulse w-full">Loading {title}...</div>}
      </div>
    </section>
  );

  return (
    <div className="p-4 md:p-8 space-y-16 pb-40">

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 pb-2">
            {timeOfDay()}{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg">Welcome to the future of sound.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 hover:border-primary/50 transition-colors">
            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
            Stats
          </Button>
        </div>
      </motion.div>

      {/* Hero Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Featured Hero (Span 2) */}
        <div className="lg:col-span-2">
          {featuredSong ? (
            <FeaturedHero playlist={{
              id: featuredSong.id,
              _id: featuredSong.id,
              name: featuredSong.name,
              description: "Featured Track of the Day",
              coverUrl: convertImage(featuredSong.image),
              tracks: [mapSongToTrack(featuredSong)],
              createdBy: "System",
              isPublic: true,
              songCount: "1",
              image: featuredSong.image,
            } as any} />
          ) : (
            <div className="h-96 rounded-3xl bg-zinc-900/50 animate-pulse glass-panel flex items-center justify-center text-zinc-600">Loading Feature...</div>
          )}

          {/* Live Visualizer (Newly Added) */}
          <div className="mt-6">
            <LiveVisualizer />
          </div>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6 flex flex-col h-full">

          {/* Global Trending Bento Box */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex-1 flex flex-col min-h-[300px] lg:min-h-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500 animate-pulse" />
                <h3 className="text-lg font-bold text-white tracking-wide">Global Pulse</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white h-7">View All</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar flex-1">
              {globalSongs.length > 0 ? globalSongs.map(song => (
                <div key={song.id} className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer" onClick={() => handlePlaySong(song, globalSongs)}>
                  <img src={convertImage(song.image)} alt={song.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-8 h-8 text-white fill-current drop-shadow-[0_0_10px_black]" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-xs font-bold text-white truncate">{song.name}</p>
                  </div>
                </div>
              )) : <p className="text-zinc-500 text-sm">Loading...</p>}
            </div>
          </div>

          {/* Top Artists List */}
          <motion.div
            className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-[#1a103c]/50 to-black/50 border-purple-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Top Artists</h3>
            </div>

            <div className="space-y-3">
              {topArtists.slice(0, 4).map((artist, idx) => (
                <div key={artist.id} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors">
                  <span className="text-xs font-mono text-zinc-600 w-4 text-center group-hover:text-purple-400">0{idx + 1}</span>
                  <img src={convertImage(artist.image)} alt={artist.name} className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-purple-500 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">{artist.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{artist.type || 'Artist'}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Futuristic Playlists Section (New) */}
      <section>
        <div className="flex items-center gap-3 mb-6 px-2 md:px-0">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Disc3 className="w-6 h-6 text-primary animate-spin-slow" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white text-glow">Curated for You</h2>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
          {futuristicPlaylists.map((playlist, i) => (
            <div key={playlist.id} className="min-w-[280px] md:min-w-0 snap-center mr-4 md:mr-0">
              <PlaylistCard playlist={playlist as any} index={i} isNew={i === 0} showPlayCount />
            </div>
          ))}
        </div>
      </section>

      {/* Language Sections */}
      <div className="space-y-16">
        <SectionRow title="Trending Now" songs={trendingSongs} icon={Flame} colorClass="text-orange-500" />
        <SectionRow title="Trending Hindi & Bollywood" songs={hindiSongs} icon={TrendingUp} colorClass="text-red-500" />
        <SectionRow title="International Top Hits" songs={englishSongs} icon={Sparkles} colorClass="text-blue-400" />
        <SectionRow title="Malayalam Melodies" songs={malayalamSongs} icon={Disc3} colorClass="text-green-500" />
        <SectionRow title="Tamil Chartbusters" songs={tamilSongs} icon={Flame} colorClass="text-orange-500" />
      </div>
    </div>
  );
};

export default Home;