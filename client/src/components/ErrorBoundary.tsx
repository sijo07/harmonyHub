import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
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
                <div className="min-h-screen w-full bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden">
                    {/* Animated Background Gradients */}
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md w-full z-10"
                    >
                        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
                            <div className="w-20 h-20 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/50">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Something skipped a beat.</h1>
                            <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                                We encountered an unexpected error while playing your experience.
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl h-12 font-semibold flex items-center justify-center gap-2 group"
                                >
                                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                    Try Again
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => window.location.href = '/'}
                                    className="w-full text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl h-12 font-medium flex items-center justify-center gap-2"
                                >
                                    <Home className="w-4 h-4" />
                                    Return Home
                                </Button>
                            </div>

                            {process.env.NODE_ENV !== 'production' && this.state.error && (
                                <div className="mt-8 pt-6 border-t border-white/5 text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">Error Preview</p>
                                    <pre className="text-xs text-red-400/70 bg-black/40 p-3 rounded-lg overflow-x-auto font-mono">
                                        {this.state.error.message}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
