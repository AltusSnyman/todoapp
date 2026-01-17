import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { GlassCard } from "./GlassCard";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
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
                <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-50">
                    {/* Global background is already in body, so this sits on top */}
                    <GlassCard className="max-w-md w-full p-8 flex flex-col items-center text-center border-red-500/30 bg-slate-950/80">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            <AlertTriangle size={32} />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-gray-400 mb-6 text-sm">
                            {this.state.error?.message || "An unexpected error occurred."}
                        </p>

                        <div className="p-4 rounded-lg bg-black/40 border border-white/5 w-full mb-6 overflow-hidden">
                            <code className="text-xs text-red-300 font-mono break-all">
                                {this.state.error?.message}
                            </code>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center gap-2 font-medium"
                        >
                            <RefreshCw size={18} />
                            Reload Application
                        </button>
                    </GlassCard>
                </div>
            );
        }

        return this.props.children;
    }
}
