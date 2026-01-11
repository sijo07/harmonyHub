import { useAuth } from "@/contexts/AuthContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Button } from "@/components/ui/button";
import { Edit, User, Mail, Music, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { motion } from "framer-motion";
import { useState } from "react";

const Profile = () => {
    const { user, logout } = useAuth();
    const { favorites, playlists } = usePlayer();
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
                <p className="text-zinc-400 mb-6">You need to be logged in to view your profile.</p>
                <Link to="/auth">
                    <Button className="bg-primary hover:bg-primary/80">Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl pt-8 pb-20">
            <Link to="/" className="inline-flex items-center text-zinc-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center relative z-10">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-zinc-800 to-black border-4 border-white/5 flex items-center justify-center shadow-2xl mb-4 relative group">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-zinc-500" />
                            )}
                            <button
                                onClick={() => setIsEditDialogOpen(true)}
                                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-lg lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:scale-110"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-2">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:bg-white/5 text-white gap-2"
                                onClick={() => setIsEditDialogOpen(true)}
                            >
                                <Edit className="w-4 h-4" /> Edit Profile
                            </Button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <Music className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{favorites.length}</p>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Liked Songs</p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{playlists.length}</p>
                                    <p className="text-xs text-zinc-400 uppercase tracking-wider">Playlists</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex justify-center md:justify-end">
                    <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={logout}>
                        Log Out
                    </Button>
                </div>

            </motion.div>

            <EditProfileDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                currentUser={user}
            />
        </div>
    );
};

export default Profile;
