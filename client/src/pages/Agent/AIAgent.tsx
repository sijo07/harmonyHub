import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Send, Bot, Cpu, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

const AIAgent = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I am Harmony, your advanced musical companion. I can analyze your listening habits, generate futuristic playlists, or explore new sonic landscapes with you." }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [processingStep, setProcessingStep] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, processingStep]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate complex AI processing
        const steps = [
            "Analyzing semantic intent...",
            "Scanning global charts...",
            "Cross-referencing acoustic fingerprints...",
            "Synthesizing recommendations..."
        ];

        let stepIndex = 0;

        const processInterval = setInterval(() => {
            if (stepIndex < steps.length) {
                setProcessingStep(steps[stepIndex]);
                stepIndex++;
            } else {
                clearInterval(processInterval);
                setProcessingStep(null);

                // Generate response based on keywords
                let response = "I've processed your request using my neural engine. Here are some thoughts on that.";
                if (userMsg.toLowerCase().includes("playlist")) {
                    response = "I've crafted a sonic journey for you. It blends atmospheric synth-wave with high-tempo basslines to match your stated vibe. Shall I queue it up?";
                } else if (userMsg.toLowerCase().includes("recommend") || userMsg.toLowerCase().includes("song")) {
                    response = "Based on your recent listening to 'The Weeknd', I predict you'll resonate with the latest track from 'Kavinsky' featuring 'The Midnight'. It has a 94% compatibility score.";
                } else if (userMsg.toLowerCase().includes("hello") || userMsg.toLowerCase().includes("hi")) {
                    response = "Greetings. My systems are fully operational and ready to serve your auditory needs.";
                }

                setMessages(prev => [...prev, { role: 'assistant', content: response }]);
                setIsTyping(false);
            }
        }, 800);
    };

    return (
        <div className="h-[calc(100vh-6rem)] max-w-4xl mx-auto p-4 flex flex-col">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-600 blur-lg opacity-40 animate-pulse" />
                    <div className="bg-black border border-purple-500/30 p-3 rounded-xl relative">
                        <Cpu className="w-8 h-8 text-purple-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-ping" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Harmony Core
                    </h1>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span>Generic Intelligence Online</span>
                    </div>
                </div>
            </motion.div>

            <Card className="flex-1 bg-black/40 border-white/10 flex flex-col overflow-hidden backdrop-blur-sm shadow-2xl">
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-zinc-800 border-zinc-700' : 'bg-purple-900/20 border-purple-500/30'}`}>
                                        {msg.role === 'user' ? (
                                            <span className="font-bold text-zinc-400">U</span>
                                        ) : (
                                            <Bot className="w-5 h-5 text-purple-400" />
                                        )}
                                    </div>
                                    <div className={`p-4 rounded-2xl border ${msg.role === 'user' ? 'bg-zinc-800/80 border-zinc-700 text-zinc-100' : 'bg-purple-900/10 border-purple-500/20 text-purple-100'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Processing Indicator */}
                        <AnimatePresence>
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex gap-4 max-w-[80%]">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border bg-purple-900/20 border-purple-500/30">
                                            <Sparkles className="w-5 h-5 text-purple-400 animate-spin-slow" />
                                        </div>
                                        <div className="p-4 rounded-2xl border bg-purple-900/10 border-purple-500/20 text-purple-300 font-mono text-xs flex items-center gap-2">
                                            {processingStep ? (
                                                <>
                                                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                                    {processingStep}
                                                </>
                                            ) : (
                                                <div className="flex gap-1">
                                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-0" />
                                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100" />
                                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-200" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 bg-black/60 border-t border-white/10 backdrop-blur-md">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex gap-3"
                    >
                        <div className="relative flex-1">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Command the core..."
                                disabled={isTyping}
                                className="bg-zinc-900/50 border-white/10 text-white focus-visible:ring-purple-500 pl-4 h-12 rounded-xl"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1 h-1 bg-zinc-600 rounded-full" />
                                ))}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            size="icon"
                            disabled={isTyping || !input.trim()}
                            className="bg-purple-600 hover:bg-purple-500 h-12 w-12 rounded-xl transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                        >
                            <Send className="w-5 h-5" />
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default AIAgent;
