import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { GlassCard } from "./GlassCard";
import { X, Flag, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: any;
}

const priorities = ["High", "Medium", "Low"];
const times = [
    { label: "+1 Hour", val: 60 * 60 * 1000 },
    { label: "+1 Day", val: 24 * 60 * 60 * 1000 },
    { label: "+1 Week", val: 7 * 24 * 60 * 60 * 1000 },
];

export function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
    const updateTask = useMutation(api.tasks.update);
    const deleteTask = useMutation(api.tasks.deleteT);
    const toggleComplete = useMutation(api.tasks.toggleComplete);

    const [text, setText] = useState("");
    const [priority, setPriority] = useState("Medium");

    useEffect(() => {
        if (task) {
            setText(task.text);
            setPriority(task.priority);
        }
    }, [task]);

    const handleSave = async () => {
        if (!task || !text) return;
        await updateTask({
            id: task._id,
            text,
            priority: priority as any,
        });
        onClose();
    };

    const handleExtend = async (addedTime: number) => {
        if (!task) return;
        const currentDeadline = task.deadline || Date.now();
        await updateTask({
            id: task._id,
            deadline: currentDeadline + addedTime
        });
        // Optional: Show some feedback
    };

    const handleComplete = async () => {
        if (!task) return;
        await toggleComplete({ id: task._id, isCompleted: true });
        onClose();
    };

    const handleDelete = async () => {
        if (!task) return;
        if (confirm("Are you sure you want to delete this task?")) {
            await deleteTask({ id: task._id });
            onClose();
        }
    };

    if (!task) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={onClose}
                    >
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
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        Edit Task <span className="text-gray-500 text-sm font-normal">in {task.projectId}</span>
                                    </h2>
                                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col gap-6">

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Task Description</label>
                                        <textarea
                                            className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[--color-neon-blue] transition-all text-lg resize-none min-h-[100px]"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Flag size={12} /> Priority</label>
                                            <div className="flex flex-col gap-2">
                                                {priorities.map(p => (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPriority(p)}
                                                        className={cn(
                                                            "px-3 py-2 text-sm rounded-lg border transition-all text-left",
                                                            priority === p
                                                                ? "bg-white/10 text-white border-white/20"
                                                                : "border-transparent text-gray-500 hover:bg-white/5"
                                                        )}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-2"><Clock size={12} /> Extend Deadline</label>
                                            <div className="flex flex-col gap-2">
                                                {times.map(t => (
                                                    <button
                                                        key={t.label}
                                                        onClick={() => handleExtend(t.val)}
                                                        className="px-3 py-2 text-sm rounded-lg border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 hover:border-[--color-neon-blue]/50 transition-all text-left flex justify-between items-center"
                                                    >
                                                        {t.label}
                                                        <Clock size={14} className="opacity-50" />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-xs text-gray-600 mt-2">
                                                Current Due: {task.deadline ? new Date(task.deadline).toLocaleString() : "None"}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Actions Footer */}
                                <div className="p-4 bg-black/20 border-t border-white/5 flex gap-3">
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>

                                    <div className="flex-1 flex justify-end gap-3">
                                        <button
                                            onClick={handleComplete}
                                            className="px-4 py-2 text-sm text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors flex items-center gap-2 border border-green-500/20"
                                        >
                                            <CheckCircle2 size={16} /> Complete
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2 bg-gradient-to-r from-[--color-neon-blue] to-[--color-neon-purple] text-white font-semibold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(157,0,255,0.5)] transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
