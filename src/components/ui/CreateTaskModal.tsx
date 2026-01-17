import { useState } from "react";
// We might need to install this or build a custom one. Let's build custom for glass feel.
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GlassCard } from "../ui/GlassCard";
import { X, Flag, Folder, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultProject?: string;
}

const projects = ["System Pros Ai", "Skool", "Social Media", "Personal"];
const priorities = ["High", "Medium", "Low"];
const times = [
    { label: "1 Hour", val: 60 * 60 * 1000 },
    { label: "2 Hours", val: 2 * 60 * 60 * 1000 },
    { label: "1 Day", val: 24 * 60 * 60 * 1000 },
    { label: "1 Week", val: 7 * 24 * 60 * 60 * 1000 },
    { label: "1 Month", val: 30 * 24 * 60 * 60 * 1000 }
];

export function CreateTaskModal({ isOpen, onClose, defaultProject }: CreateTaskModalProps) {
    const createTask = useMutation(api.tasks.create);

    const [text, setText] = useState("");
    const [project, setProject] = useState(defaultProject || projects[0]);
    const [priority, setPriority] = useState("Medium");
    const [duration, setDuration] = useState<number | null>(null);

    const handleSubmit = async () => {
        if (!text) return;

        await createTask({
            text,
            projectId: project as any,
            priority: priority as any,
            deadline: duration ? Date.now() + duration : undefined
        });

        onClose();
        setText("");
        setDuration(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg"
                        >
                            <GlassCard className="p-0 overflow-visible border-white/10 shadow-2xl bg-slate-900/90">
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <h2 className="text-lg font-bold text-white">Create New Task</h2>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col gap-6">

                                    {/* Text Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">What needs to be done?</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="Type your task here..."
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[--color-neon-blue] transition-all text-lg"
                                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                        />
                                    </div>

                                    {/* Selectors Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Project Select */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Folder size={12} /> Project</label>
                                            <div className="flex flex-wrap gap-2">
                                                {projects.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setProject(p)}
                                                        className={cn(
                                                            "px-2 py-1 text-xs rounded-md border transition-all",
                                                            project === p
                                                                ? "bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                                                : "border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Priority Select */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Flag size={12} /> Priority</label>
                                            <div className="flex gap-2">
                                                {priorities.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPriority(p)}
                                                        className={cn(
                                                            "px-3 py-1 text-xs rounded-full border transition-all",
                                                            priority === p
                                                                ? p === 'High' ? "bg-red-500/20 text-red-200 border-red-500/50" : p === 'Medium' ? "bg-yellow-500/20 text-yellow-200 border-yellow-500/50" : "bg-green-500/20 text-green-200 border-green-500/50"
                                                                : "border-transparent text-gray-500 hover:bg-white/5"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Select */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Clock size={12} /> Duration / Due In</label>
                                        <div className="flex flex-wrap gap-2">
                                            {times.map(t => (
                                                <button
                                                    key={t.label}
                                                    onClick={() => setDuration(t.val)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-xs rounded-lg border transition-all",
                                                        duration === t.val
                                                            ? "bg-[--color-neon-blue]/10 text-[--color-neon-blue] border-[--color-neon-blue]/30"
                                                            : "border-white/5 text-gray-500 hover:bg-white/5"
                                                    )}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {/* Footer */}
                                <div className="p-4 bg-black/20 border-t border-white/5 flex justify-end gap-3">
                                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Cancel</button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-gradient-to-r from-[--color-neon-blue] to-[--color-neon-purple] text-white font-semibold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(157,0,255,0.5)] transition-all transform hover:scale-105"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
