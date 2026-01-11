import { Link, useLocation } from "react-router-dom";
import { Home, Search, Library, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const MobileNav = () => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: Search, label: "Search", path: "/search" },
        { icon: Library, label: "Library", path: "/library" },
        { icon: User, label: "Profile", path: "/admin" }, // Using Admin/Profile path
    ];

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
            <div className="glass-panel backdrop-blur-3xl rounded-3xl flex items-center justify-around p-3 shadow-2xl pointer-events-auto border border-white/10 h-16">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
                                isActive ? "text-primary" : "text-zinc-400 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobileNavActive"
                                    className="absolute inset-0 bg-primary/10 rounded-2xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}

                            <Icon className={cn("w-5 h-5 relative z-10 transition-transform", isActive ? "fill-current drop-shadow-[0_0_8px_var(--neon-pink)] scale-110" : "")} />

                            {isActive && (
                                <motion.div
                                    className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_var(--neon-pink)]"
                                    layoutId="mobileNavDot"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
