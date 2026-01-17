import { useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface LoginProps {
    onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();

        if (passcode === "W_Sman84") {
            onLogin();
        } else {
            setError(true);
            setPasscode("");
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
            {/* Using global body background instead of local layers */}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <GlassCard className="p-8 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[--color-neon-blue] to-[--color-neon-purple] flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
                        <Lock className="text-white w-8 h-8" />
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 mb-8 text-center">Please enter the access code to continue.</p>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                value={passcode}
                                onChange={(e) => {
                                    setPasscode(e.target.value);
                                    if (error) setError(false);
                                }}
                                placeholder="Enter passcode"
                                className={`w-full bg-slate-950/50 border rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none transition-all text-center tracking-widest text-lg
                                    ${error
                                        ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                        : "border-white/5 focus:border-[--color-neon-blue] focus:shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                                    }
                                `}
                                autoFocus
                            />
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
                                >
                                    <AlertCircle size={20} />
                                </motion.div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[--color-neon-blue] to-[--color-neon-purple] text-white font-bold rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            Access Dashboard
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </GlassCard>
            </motion.div>
        </div>
    );
}
