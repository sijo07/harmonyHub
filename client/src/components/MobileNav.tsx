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
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none">
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around p-2 shadow-2xl pointer-events-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300",
                                isActive ? "text-white" : "text-white/40 hover:text-white/80"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobileNavActive"
                                    className="absolute inset-0 bg-white/10 rounded-xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}

                            <Icon className={cn("w-6 h-6 mb-1 relative z-10", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium relative z-10">{item.label}</span>

                            {isActive && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};
