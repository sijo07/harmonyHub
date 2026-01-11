import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-mono">
                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_4px,6px_100%]" />

                    <div className="relative z-20 max-w-lg w-full border border-red-500/30 bg-black/50 p-8 rounded-lg backdrop-blur-sm shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                        <div className="flex items-center gap-3 text-red-500 mb-6 border-b border-red-500/20 pb-4">
                            <AlertTriangle className="w-8 h-8 animate-pulse" />
                            <h1 className="text-2xl font-bold tracking-wider">SYSTEM MALFUNCTION</h1>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-red-400/80 text-sm leading-relaxed">
                                &gt; Critical error detected in playback module.<br />
                                &gt; Signal processing failed.<br />
                                &gt; Automatic recovery initiated... failed.
                            </p>

                            {this.state.error && (
                                <div className="bg-red-950/30 p-4 rounded border border-red-900/50 text-xs text-red-300 font-mono break-all">
                                    {this.state.error.toString()}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 hover:bg-red-700 text-white font-mono tracking-widest gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                REBOOT SYSTEM
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
