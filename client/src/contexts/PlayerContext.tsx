import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track, Playlist } from "@/types/music";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

interface PlayerContextType {
  // ... same as before
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  currentTime: number;
  duration: number;
  volume: number;
  favorites: Track[];
  playlists: Playlist[];
  analyser: AnalyserNode | null;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  changeVolume: (val: number) => void;
  seek: (time: number) => void;
  toggleFavorite: (track: Track) => Promise<void>;
  isFavorite: (trackId?: string) => boolean;
  createPlaylist: (name: string) => Promise<Playlist | undefined>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  addToPlaylist: (playlistId: string, track: Track) => Promise<void>;
  removeFromPlaylist: (playlistId: string, trackUrl: string) => Promise<void>;
  playPlaylist: (tracks: Track[]) => void;
  isQueueOpen: boolean;
  toggleQueue: () => void;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  progress: number;
  setProgress: (time: number) => void;
  setVolume: (val: number) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  lyrics: string | null;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'one' | 'all'>('off');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]);

  const { user, isAuthenticated, checkUser } = useAuth();

  const [favorites, setFavorites] = useState<Track[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('playlists');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync favorites and playlists when user data changes
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.likedSongs) {
        const mappedFavorites: Track[] = user.likedSongs.map((song: any) => ({
          id: song.id,
          title: song.title,
          artist: song.artist,
          album: song.album,
          coverUrl: song.image,
          duration: song.duration,
          previewUrl: song.audioUrl
        }));
        setFavorites(mappedFavorites);
      }
      if (user.playlists) {
        setPlaylists(user.playlists);
      }
    }
  }, [user, isAuthenticated]);

  // Update local storage for guests / local cache
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const audioRef = useRef(new Audio());
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const anal = ctx.createAnalyser();
        anal.fftSize = 256;
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          source.connect(anal);
          anal.connect(ctx.destination);
          audioContextRef.current = ctx;
          sourceRef.current = source;
          setAnalyser(anal);
        } catch (e) {
          console.error("Error setting up audio context:", e);
        }
      }
    }
  }, []);

  const ensureAudioContext = () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Persistence Logic
  useEffect(() => {
    const savedState = localStorage.getItem('harmony_player_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.currentTrack) setCurrentTrack(parsed.currentTrack);
        if (parsed.queue) setQueue(parsed.queue);
        if (typeof parsed.currentIndex === 'number') setCurrentIndex(parsed.currentIndex);
        if (typeof parsed.volume === 'number') setVolume(parsed.volume);
        if (typeof parsed.shuffle === 'boolean') setShuffle(parsed.shuffle);
        if (parsed.repeat) setRepeat(parsed.repeat);
        // We do NOT restore isPlaying to avoid auto-play issues
      } catch (e) {
        console.error("Failed to restore player state", e);
      }
    }
  }, []);

  useEffect(() => {
    const state = {
      currentTrack,
      queue,
      currentIndex,
      volume,
      shuffle,
      repeat
    };
    localStorage.setItem('harmony_player_state', JSON.stringify(state));
  }, [currentTrack, queue, currentIndex, volume, shuffle, repeat]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.crossOrigin = "anonymous";
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const onEnded = () => nextTrack();
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [queue, currentIndex, repeat]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const shuffleArray = (array: any[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const fetchLyrics = async (trackId: string) => {
    setLyrics("Loading lyrics...");
    try {
      const data = await api.getLyrics(trackId);
      if (data && data.lyrics) {
        setLyrics(data.lyrics);
      } else {
        setLyrics("Lyrics not available for this track.");
      }
    } catch (error) {
      setLyrics("Failed to load lyrics.");
    }
  };

  const playTrack = async (track: Track, newQueue: Track[] = []) => {
    ensureAudioContext();
    if (currentTrack?.previewUrl === track.previewUrl) {
      togglePlay();
      return;
    }

    if (newQueue.length > 0) {
      setOriginalQueue(newQueue);
      if (shuffle) {
        const shuffled = shuffleArray(newQueue);
        const filtered = shuffled.filter(t => (t.id || t.previewUrl) !== (track.id || track.previewUrl));
        const finalQueue = [track, ...filtered];
        setQueue(finalQueue);
        setCurrentIndex(0);
      } else {
        setQueue(newQueue);
        const index = newQueue.findIndex(t => (t.id || t.previewUrl) === (track.id || track.previewUrl));
        setCurrentIndex(index >= 0 ? index : 0);
      }
    } else {
      const index = queue.findIndex(t => (t.id || t.previewUrl) === (track.id || track.previewUrl));
      if (index >= 0) setCurrentIndex(index);
    }

    const audioSrc = track.previewUrl || track.downloadUrl?.[0]?.link || track.audioUrl;
    if (audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
    setCurrentTrack(track);
    fetchLyrics(track.id || "");
  };

  const togglePlay = () => {
    ensureAudioContext();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = async () => {
    if (queue.length === 0 || currentIndex === -1) return;

    // Repeat One logic
    if (repeat === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    // Checking if we are at the end of the queue
    if (currentIndex === queue.length - 1) {
      if (repeat === 'off') {
        // Autoplay Logic: Fetch similar songs
        console.log("Queue ended, fetching similar songs for autoplay...");
        try {
          // Use current artist to find similar songs
          // Note: api.searchSongs returns { data: { results: [...] } }
          const similarSongsRes = await api.searchSongs(currentTrack?.artist || "trending");
          const newTracks = similarSongsRes?.data?.results || [];

          if (newTracks.length > 0) {
            // Map API response to Track interface
            const mappedTracks: Track[] = newTracks.map((item: any) => ({
              id: item.id,
              title: item.name || item.title,
              artist: item.artist || (item.artists?.primary?.[0]?.name) || "Unknown",
              album: item.album?.name || item.album || "Unknown Album",
              coverUrl: item.image?.[item.image.length - 1]?.link || item.image || "",
              duration: parseInt(item.duration) || 0,
              previewUrl: item.downloadUrl?.[item.downloadUrl.length - 1]?.link || item.previewUrl || ""
            })).filter((t: Track) => t.previewUrl);

            // Filter out duplicates that are already in the queue
            const uniqueNewTracks = mappedTracks.filter((track: Track) =>
              !queue.some(qTrack => qTrack.id === track.id)
            );

            if (uniqueNewTracks.length > 0) {
              const nextSong = uniqueNewTracks[0];
              const updatedQueue = [...queue, ...uniqueNewTracks];

              setQueue(updatedQueue);
              setCurrentIndex(currentIndex + 1);
              setCurrentTrack(nextSong);

              const audioSrc = nextSong.previewUrl;
              if (audioSrc) {
                audioRef.current.src = audioSrc;
                audioRef.current.play();
                setIsPlaying(true);
                fetchLyrics(nextSong.id || "");
              }
            }
          }
        } catch (error) {
          console.error("Autoplay failed:", error);
        }

        // If autoplay failed or no new songs, stop.
        setIsPlaying(false);
        return;
      }
    }

    const nextIndex = (currentIndex + 1) % queue.length;
    const nextSong = queue[nextIndex];
    setCurrentIndex(nextIndex);
    setCurrentTrack(nextSong);
    const audioSrc = nextSong.previewUrl || nextSong.downloadUrl?.[0]?.link || nextSong.audioUrl;
    if (audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
      setIsPlaying(true);
      fetchLyrics(nextSong.id || "");
    }
  };

  const prevTrack = () => {
    if (queue.length === 0 || currentIndex === -1) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      if (repeat === 'all') prevIndex = queue.length - 1;
      else { audioRef.current.currentTime = 0; return; }
    }
    const prevSong = queue[prevIndex];
    setCurrentIndex(prevIndex);
    setCurrentTrack(prevSong);
    const audioSrc = prevSong.previewUrl || prevSong.downloadUrl?.[0]?.link || prevSong.audioUrl;
    if (audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
      setIsPlaying(true);
      fetchLyrics(prevSong.id || "");
    }
  };

  const changeVolume = (val: number) => {
    setVolume(val);
    audioRef.current.volume = val;
  };

  const seek = (time: number) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFavorite = async (track: Track) => {
    const isFav = favorites.some(f => (f.id || f.previewUrl) === (track.id || track.previewUrl));

    // Optimistic update
    if (isFav) setFavorites(favorites.filter(f => (f.id || f.previewUrl) !== (track.id || track.previewUrl)));
    else setFavorites([...favorites, track]);

    if (isAuthenticated) {
      try {
        if (isFav) await api.removeFromFavorites(track.id);
        else await api.addToFavorites(track as any);
        await checkUser();
      } catch (error) {
        console.error("Favorite sync failed", error);
      }
    }
  };

  const isFavorite = (trackId?: string) => {
    if (trackId) return favorites.some(f => f.id === trackId);
    return currentTrack ? favorites.some(f => f.previewUrl === currentTrack.previewUrl) : false;
  };

  const createPlaylist = async (name: string) => {
    if (isAuthenticated) {
      try {
        const newPlaylist = await api.createPlaylist({ name });
        await checkUser();
        return newPlaylist;
      } catch (error) {
        console.error("Create playlist failed", error);
      }
    }
    const newPlaylist: Playlist = { id: Date.now().toString(), name, tracks: [], createdAt: new Date().toISOString() };
    setPlaylists([...playlists, newPlaylist]);
    return newPlaylist;
  };

  const deletePlaylist = async (playlistId: string) => {
    if (isAuthenticated) {
      try {
        await api.deletePlaylist(playlistId);
        await checkUser();
      } catch (error) {
        console.error("Delete playlist failed", error);
      }
    }
    setPlaylists(playlists.filter(p => p.id !== playlistId));
  };

  const addToPlaylist = async (playlistId: string, track: Track) => {
    if (isAuthenticated) {
      try {
        await api.addSongToPlaylist(playlistId, track as any);
        await checkUser();
      } catch (error) {
        console.error("Add to playlist failed", error);
      }
    }
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId && !p.tracks.some(t => t.previewUrl === track.previewUrl)) {
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    }));
  };

  const removeFromPlaylist = async (playlistId: string, trackUrl: string) => {
    if (trackUrl && isAuthenticated) {
      try {
        // We need songId for the backend, but we have trackUrl. 
        // The backend removeSongFromPlaylist takes songId.
        const playlist = playlists.find(p => p.id === playlistId || p._id === playlistId);
        const song = playlist?.tracks.find(t => t.previewUrl === trackUrl);
        if (song?.id) {
          await api.removeSongFromPlaylist(playlistId, song.id);
          await checkUser();
        }
      } catch (error) {
        console.error("Remove from playlist failed", error);
      }
    }
    setPlaylists(playlists.map(p => (p.id === playlistId || p._id === playlistId) ? { ...p, tracks: p.tracks.filter(t => t.previewUrl !== trackUrl) } : p));
  };
  const playPlaylist = (tracks: Track[]) => tracks.length > 0 && playTrack(tracks[0], tracks);
  const toggleQueue = () => setIsQueueOpen(prev => !prev);
  const toggleShuffle = () => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    if (newShuffle && currentTrack) {
      const shuffled = shuffleArray(queue);
      const filtered = shuffled.filter(t => (t.id || t.previewUrl) !== (currentTrack.id || currentTrack.previewUrl));
      setQueue([currentTrack, ...filtered]);
      setCurrentIndex(0);
    } else if (!newShuffle && currentTrack) {
      const index = originalQueue.findIndex(t => (t.id || t.previewUrl) === (currentTrack.id || currentTrack.previewUrl));
      setQueue(originalQueue);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  };
  const toggleRepeat = () => setRepeat(prev => prev === 'off' ? 'one' : prev === 'one' ? 'all' : 'off');
  const toggleFullScreen = () => setIsFullScreen(prev => !prev);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowRight': if (e.ctrlKey) nextTrack(); else seek(Math.min(audioRef.current.duration, audioRef.current.currentTime + 10)); break;
        case 'ArrowLeft': if (e.ctrlKey) prevTrack(); else seek(Math.max(0, audioRef.current.currentTime - 10)); break;
        case 'KeyM': changeVolume(volume === 0 ? 0.5 : 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrack, queue, currentIndex, volume, repeat, shuffle]);

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const value = {
    currentTrack, isPlaying, queue, currentTime, duration, volume, favorites, playlists, analyser,
    isQueueOpen, toggleQueue, playTrack, togglePlay, nextTrack, prevTrack, changeVolume, seek,
    toggleFavorite, isFavorite, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist,
    playPlaylist, shuffle, repeat, toggleShuffle, toggleRepeat, isFullScreen, toggleFullScreen,
    progress: currentTime, setProgress: seek, setVolume: changeVolume,
    pauseTrack: () => { if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } },
    resumeTrack: () => { if (!isPlaying) { audioRef.current.play(); setIsPlaying(true); } },
    lyrics,
    addToQueue
  };


  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};
