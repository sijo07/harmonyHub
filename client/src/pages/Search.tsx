import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, Mic, TrendingUp, History, Music2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrackCard } from "@/components/TrackCard";
import { convertImage, Song } from "@/services/api";
import { useMusic } from "@/hooks/use-music";

const genres = [
  { name: "Pop", color: "from-pink-600 to-rose-600", emoji: "🎤" },
  { name: "Hip-Hop", color: "from-amber-600 to-orange-700", emoji: "🎧" },
  { name: "Rock", color: "from-red-600 to-red-800", emoji: "🎸" },
  { name: "Electronic", color: "from-purple-600 to-indigo-600", emoji: "🎹" },
  { name: "Jazz", color: "from-blue-600 to-indigo-700", emoji: "🎺" },
  { name: "Classical", color: "from-emerald-600 to-teal-700", emoji: "🎻" },
  { name: "R&B", color: "from-fuchsia-600 to-pink-700", emoji: "💜" },
  { name: "Country", color: "from-yellow-600 to-amber-700", emoji: "🤠" },
  { name: "Latin", color: "from-orange-600 to-red-700", emoji: "💃" },
  { name: "Indie", color: "from-cyan-600 to-blue-700", emoji: "🌟" },
  { name: "Metal", color: "from-zinc-600 to-zinc-900", emoji: "🤘" },
  { name: "Chill", color: "from-teal-600 to-cyan-700", emoji: "😌" },
];

const trendingSearches = ["Taylor Swift", "Bad Bunny", "The Weeknd", "Drake"];

const Search = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Song[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : ["Daft Punk", "Summer Vibes", "Workout Mix", "Lo-fi beats"];
  });
  const { search, isLoading } = useMusic();

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await search(query);
        if (res) {
          setResults(res);
        }
      } catch (error) {
        console.error("Search failed", error);
      }
    };

    const debounce = setTimeout(performSearch, 500);
    return () => clearTimeout(debounce);
  }, [query, search]);

  const addToHistory = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => {
      const newHistory = [term, ...prev.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const handleSearchSelect = (term: string) => {
    setQuery(term);
    addToHistory(term);
  };

  const handleGenreClick = (genreName: string) => {
    const searchTerm = `${genreName} Hits`;
    setQuery(searchTerm);
    addToHistory(searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mapSongToTrack = (song: Song) => ({
    id: song.id,
    title: song.title || song.name,
    artist: Array.isArray(song.artist) ? song.artist.map(a => a.name).join(", ") : song.artist,
    album: song.album.name || "",
    coverUrl: song.coverUrl || convertImage(song.image),
    duration: parseInt(song.duration) || 0,
    audioUrl: song.previewUrl,
    previewUrl: song.previewUrl
  });

  return (
    <div className="p-4 md:p-8 pb-32 space-y-8 relative min-h-screen">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full relative z-50"
      >
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Discover</h1>
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full opacity-20 group-hover:opacity-50 blur transition duration-500" />
          <div className="relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input
              type="text"
              placeholder="What do you want to listen to?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={(e) => e.key === 'Enter' && addToHistory(query)}
              className="pl-14 pr-24 h-14 text-lg bg-black/60 backdrop-blur-xl border-white/10 rounded-full focus:ring-2 focus:ring-red-500/50 transition-all shadow-xl"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {query && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setQuery("")}
                  className="text-zinc-400 hover:text-white rounded-full hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <div className="w-px h-6 bg-white/10 mx-1" />
              <Button variant="ghost" size="icon-sm" className="text-red-500 hover:bg-red-500/10 rounded-full">
                <Mic className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Live Dropdown Overlay */}
        <AnimatePresence>
          {(isFocused || query) && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className="absolute z-50 w-full glass-panel rounded-2xl shadow-2xl border border-white/10 mt-2 overflow-hidden max-h-[70vh] flex flex-col"
            // style={{ pointerEvents: (isFocused || query) ? 'auto' : 'none' }} // causing issues with click?
            >
              <div className="overflow-y-auto scrollbar-hide p-6">
                {!query ? (
                  // Recent & Trending
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <History className="w-4 h-4 text-zinc-500" />
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Recent</span>
                        </div>
                        {recentSearches.length > 0 && (
                          <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-400">Clear</button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {recentSearches.map((search) => (
                          <div
                            key={search}
                            onClick={() => handleSearchSelect(search)}
                            className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors"
                          >
                            <span className="text-zinc-300 group-hover:text-white">{search}</span>
                            <X
                              className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setRecentSearches(prev => {
                                  const next = prev.filter(t => t !== search);
                                  localStorage.setItem("recentSearches", JSON.stringify(next));
                                  return next;
                                });
                              }}
                            />
                          </div>
                        ))}
                        {recentSearches.length === 0 && <p className="text-zinc-600 text-sm">No recent searches</p>}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Trending</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search) => (
                          <button
                            key={search}
                            onClick={() => handleSearchSelect(search)}
                            className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Live Results
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="text-center py-10 text-zinc-500">
                        Searching...
                      </div>
                    ) : results.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Music2 className="w-5 h-5 text-blue-500" />
                          </div>
                          <h2 className="text-lg font-bold">Top Results</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {results.slice(0, 5).map((song, index) => (
                            <div
                              key={song.id}
                              className="hover:bg-white/5 p-2 rounded-lg transition-colors"
                              onClick={() => {
                                // Clear search to "close" it, but keep history potentially?
                                // User wants "auto close search"
                                setQuery("");
                                setIsFocused(false);
                              }}
                            >
                              <TrackCard track={mapSongToTrack(song)} index={index} />
                            </div>
                          ))}
                        </div>
                        {results.length > 5 && (
                          <div className="mt-4 text-center">
                            <Button variant="link" className="text-zinc-400">View all {results.length} results</Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10 text-zinc-500">
                        No results found for "{query}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background Content (Categories) */}
      <div className={`max-w-7xl mx-auto w-full space-y-12 transition-all duration-500 ${isFocused || query ? 'opacity-30 blur-sm scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <section>
          <h2 className="text-xl font-bold mb-6">Browse All Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {genres.map((genre, index) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => handleGenreClick(genre.name)}
                className={`relative h-40 rounded-2xl overflow-hidden cursor-pointer group shadow-lg`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                {/* Glass Overlay just for texture */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-20 transition-opacity backdrop-filter" />

                <div className="absolute -right-4 -bottom-4 text-[5rem] opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all rotate-[-10deg]">
                  {genre.emoji}
                </div>

                <div className="absolute top-4 left-4">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">
                    {genre.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Search;