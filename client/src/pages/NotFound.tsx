import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Music2, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/undefined") {
      console.error("404 Error: /undefined detected. Redirecting to home.");
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="relative min-h-screen w-full bg-[#030303] flex items-center justify-center overflow-hidden p-6 font-sans">
      {/* Immersive Music Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-red-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-lg w-full text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
          <Music2 className="w-12 h-12 text-white/50" />
        </div>

        <h1 className="text-8xl font-black text-white mb-2 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Track not found.</h2>
        <p className="text-zinc-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
          The path <span className="text-red-500 font-mono text-sm bg-red-500/10 px-2 py-0.5 rounded italic">"{location.pathname}"</span> seems to have been dropped from the queue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="h-14 px-8 bg-white text-black hover:bg-zinc-200 rounded-2xl group w-full sm:w-auto font-bold text-base shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
            <Link to="/">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Waves
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-14 px-8 border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 rounded-2xl w-full sm:w-auto font-bold text-base">
            <Link to="/search">
              <SearchIcon className="w-5 h-5 mr-2" />
              Search Library
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-0 right-0 text-center opacity-30">
        <p className="text-xs tracking-[0.2em] font-bold uppercase text-white">Harmony Hub • High Fidelity Music</p>
      </div>
    </div>
  );
};

export default NotFound;
