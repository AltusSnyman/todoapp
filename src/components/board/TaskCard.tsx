import { GlassCard } from "../ui/GlassCard";
import { MoreHorizontal, Calendar, Trash2, CheckCircle2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../../lib/utils";


interface TaskCardProps {
    task: any;
    onDelete?: (id: string) => void;
    onComplete?: (id: string) => void;
}

export function TaskCard({ task, onDelete, onComplete }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task._id, data: { ...task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };



    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none select-none mb-3">
            <GlassCard
                className={cn(
                    "p-4 group relative border hover:border-white/20 transition-all",
                    task.priority === "High" && "border-l-4 border-l-red-500",
                    task.priority === "Medium" && "border-l-4 border-l-yellow-500",
                    task.priority === "Low" && "border-l-4 border-l-green-500"
                )}
                hoverEffect
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                    <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full border bg-opacity-20",
                        task.priority === "High" ? "bg-red-500 text-red-200 border-red-500/30" :
                            task.priority === "Medium" ? "bg-yellow-500 text-yellow-200 border-yellow-500/30" :
                                "bg-green-500 text-green-200 border-green-500/30"
                    )}>
                        {task.priority}
                    </span>
                    <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                {/* Content */}
                <p className="text-sm font-medium text-gray-200 line-clamp-2 mb-3">
                    {task.text}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>
                            {task.deadline ? new Date(task.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' }) : "No Date"}
                        </span>
                    </div>

                    {/* Actions appear on hover */}
                    <div className="hidden group-hover:flex items-center gap-2">
                        {onComplete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onComplete(task._id); }}
                                className="p-1 hover:text-[--color-neon-blue] transition-colors" title="Complete"
                            >
                                <CheckCircle2 size={16} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(task._id); }}
                                className="p-1 hover:text-red-400 transition-colors" title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
