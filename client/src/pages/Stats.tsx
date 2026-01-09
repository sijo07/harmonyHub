import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Sector } from "recharts";
import { Activity, Clock, Heart, Disc, TrendingUp, Zap } from "lucide-react";

// Mock Data
const streamData = [
    { name: "Mon", full: 4000, short: 2400 },
    { name: "Tue", full: 3000, short: 1398 },
    { name: "Wed", full: 2000, short: 9800 },
    { name: "Thu", full: 2780, short: 3908 },
    { name: "Fri", full: 1890, short: 4800 },
    { name: "Sat", full: 2390, short: 3800 },
    { name: "Sun", full: 3490, short: 4300 },
];

const genreData = [
    { name: "Pop", value: 400, color: "#ef4444" },
    { name: "Rock", value: 300, color: "#f97316" },
    { name: "Electronic", value: 300, color: "#3b82f6" },
    { name: "Hip Hop", value: 200, color: "#8b5cf6" },
];

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    return (
        <g>
            <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" className="text-xl font-bold font-sans">
                {payload.name}
            </text>
            <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#aaa" className="text-sm font-sans">
                {`${(value / 1200 * 100).toFixed(0)}%`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 10}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={innerRadius - 6}
                outerRadius={innerRadius - 2}
                fill={fill}
            />
        </g>
    );
};

// Custom Tooltip for Area Chart
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
                <p className="text-sm font-medium mb-2 text-zinc-400">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-glow" />
                    <span className="text-lg font-bold text-white">{payload[0].value.toLocaleString()} min</span>
                </div>
            </div>
        );
    }
    return null;
};

const Stats = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="p-4 md:p-8 pb-32 space-y-8 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-between"
            >
                <div>
                    <h1 className="text-4xl font-bold mb-2 neon-text">Analytics</h1>
                    <p className="text-zinc-400">Real-time insights into your sonic journey</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-green-500">Live Updating</span>
                </div>
            </motion.div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Minutes", value: "12,453", icon: Clock, from: "from-blue-500", to: "to-cyan-500" },
                    { label: "Top Artist", value: "The Weeknd", icon: Activity, from: "from-red-500", to: "to-orange-500" },
                    { label: "Liked Songs", value: "843", icon: Heart, from: "from-pink-500", to: "to-purple-500" },
                    { label: "Power Score", value: "98", icon: Zap, from: "from-amber-400", to: "to-yellow-200" },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${stat.from} ${stat.to} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`} />

                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-zinc-400 text-sm font-medium tracking-wide uppercase">{stat.label}</p>
                                <p className="text-3xl font-bold mt-2 text-white/90">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.from} ${stat.to} shadow-lg shadow-${stat.from}/20`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Streaming Activity Area Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-panel p-6 rounded-3xl lg:col-span-2 border-t border-white/10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold">Streaming Activity</h3>
                        </div>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-zinc-400 focus:outline-none focus:ring-1 focus:ring-red-500">
                            <option>This Week</option>
                            <option>Last Week</option>
                            <option>Last Month</option>
                        </select>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={streamData}>
                                <defs>
                                    <linearGradient id="colorFull" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#52525b', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#52525b', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                                <Area
                                    type="monotone"
                                    dataKey="full"
                                    stroke="#ef4444"
                                    strokeWidth={4}
                                    fill="url(#colorFull)"
                                    animationDuration={1500}
                                    className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Genre Breakdown Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel p-6 rounded-3xl lg:col-span-1 flex flex-col relative overflow-hidden"
                >
                    {/* Decorative background blur */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Disc className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold">Top Genres</h3>
                    </div>

                    <div className="h-[300px] w-full flex-1 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={genreData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    paddingAngle={6}
                                    dataKey="value"
                                    onMouseEnter={onPieEnter}
                                    cornerRadius={8}
                                    stroke="none"
                                >
                                    {genreData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            className="transition-all duration-300 hover:brightness-110"
                                            style={{ filter: `drop-shadow(0 0 8px ${entry.color}40)` }}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center flex-wrap gap-4 mt-2 relative z-10">
                        {genreData.map((entry, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 transition-colors cursor-pointer ${activeIndex === index ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: entry.color, color: entry.color }} />
                                <span className="text-xs font-medium text-zinc-300">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Stats;
