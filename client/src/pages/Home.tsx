import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Sparkles, Disc3, Flame, Activity } from "lucide-react";
import { FeaturedHero } from "@/components/FeaturedHero";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api, convertImage, Song } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";

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
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [featuredSong, setFeaturedSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hindiRes, englishRes, tamilRes, malRes, globalRes, artistsRes] = await Promise.all([
          api.getHindiHits(),
          api.getEnglishHits(),
          api.getTamilHits(),
          api.getMalayalamHits(),
          api.searchSongs("Global Top 50"),
          api.getFeaturedArtists() // Now real
        ]);

        if (Array.isArray(hindiRes)) setHindiSongs(hindiRes.slice(0, 10));
        if (Array.isArray(englishRes)) {
          setEnglishSongs(englishRes.slice(0, 10));
          // Set featured song from English hits if available
          if (englishRes.length > 0) setFeaturedSong(englishRes[0]);
        }
        if (Array.isArray(tamilRes)) setTamilSongs(tamilRes.slice(0, 10));
        if (Array.isArray(malRes)) setMalayalamSongs(malRes.slice(0, 10));
        if (Array.isArray(globalRes.data?.results)) setGlobalSongs(globalRes.data.results.slice(0, 6)); // Display 6 global songs
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
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 ${colorClass.replace("text-", "bg-")}/10 rounded-lg`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {songs.length > 0 ? songs.map((song) => (
          <div
            key={song.id}
            className="glass-panel p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
            onClick={() => handlePlaySong(song, songs)}
          >
            <div className="relative aspect-square mb-3 overflow-hidden rounded-lg">
              <img
                src={convertImage(song.image)}
                alt={song.name}
                className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="icon" className="rounded-full bg-red-500 hover:bg-red-600 text-white">
                  <Disc3 className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <h3 className="font-semibold truncate text-white">{song.name}</h3>
            <p className="text-sm text-zinc-400 truncate">{song.artists.primary[0]?.name}</p>
          </div>
        )) : <div className="col-span-full text-center text-zinc-500">Loading {title}...</div>}
      </div>
    </section>
  );

  return (
    <div className="p-4 md:p-8 space-y-12 pb-32">
      {/* Header & New Real Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Welcome & Global Hits */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                {timeOfDay()}{user ? `, ${user.name}` : ""}
              </h1>
              <p className="text-zinc-400 mt-1">Discover trending music from around the world.</p>
            </div>
          </motion.div>

          {/* Replaced Chart with Global Hits Grid */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-zinc-200">Global Trending</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {globalSongs.length > 0 ? globalSongs.map(song => (
                <div key={song.id} className="group cursor-pointer" onClick={() => handlePlaySong(song, globalSongs)}>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                    <img src={convertImage(song.image)} alt={song.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Disc3 className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <p className="font-medium text-white truncate">{song.name}</p>
                  <p className="text-xs text-zinc-400 truncate">{song.artists.primary[0]?.name}</p>
                </div>
              )) : <p className="text-zinc-500">Loading trending...</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Top Artists */}
        <div className="space-y-4">
          {/* Top Artists (Replaced Streak) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black border-purple-500/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-400">Top Artists</span>
            </div>

            <div className="space-y-4">
              {topArtists.map(artist => (
                <div key={artist.id} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <img src={convertImage(artist.image)} alt={artist.name} className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500 transition-colors" />
                  <div>
                    <p className="font-bold text-white group-hover:text-purple-400 transition-colors">{artist.name}</p>
                    <p className="text-xs text-zinc-500 capitalize">{artist.type || 'Artist'}</p>
                  </div>
                </div>
              ))}
              {topArtists.length === 0 && <p className="text-zinc-500">Loading artists...</p>}
            </div>
          </motion.div>

          {/* Quick Picks - Tamil (Kept as it is real) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-4 rounded-xl space-y-3"
          >
            <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Tamil Picks</h4>
            {tamilSongs.slice(0, 4).map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
                onClick={() => handlePlaySong(song, tamilSongs)}
              >
                <img src={convertImage(song.image)} alt={song.name} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate group-hover:text-red-500 transition-colors text-white">{song.name}</p>
                  <p className="text-xs text-zinc-500">Song</p>
                </div>
                <Button size="icon-sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-white">
                  <Disc3 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {featuredSong && (
        <FeaturedHero playlist={{
          id: featuredSong.id,
          _id: featuredSong.id,
          name: featuredSong.name,
          description: "Featured Track",
          coverUrl: convertImage(featuredSong.image),
          tracks: [mapSongToTrack(featuredSong)],
          createdBy: "System",
          isPublic: true,
          songCount: "1",
          image: featuredSong.image,
        } as any} />
      )}

      {/* Language Sections */}
      <div className="space-y-12">
        <SectionRow title="Trending Hindi & Bollywood" songs={hindiSongs} icon={TrendingUp} colorClass="text-red-500" />
        <SectionRow title="International Top Hits" songs={englishSongs} icon={Sparkles} colorClass="text-blue-500" />
        <SectionRow title="Malayalam Melodies" songs={malayalamSongs} icon={Disc3} colorClass="text-green-500" />
        <SectionRow title="Tamil Chartbusters" songs={tamilSongs} icon={Flame} colorClass="text-orange-500" />
      </div>
    </div>
  );
};

export default Home;