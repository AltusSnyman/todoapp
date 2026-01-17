import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { TaskCard } from "./TaskCard";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners } from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GlassCard } from "../ui/GlassCard";
import { cn } from "../../lib/utils";

import { EditTaskModal } from "../ui/EditTaskModal";
import { useSortable } from "@dnd-kit/sortable";

export function KanbanBoard({ projectId }: { projectId: string }) {
    const allTasks = useQuery(api.tasks.get);
    const updateTask = useMutation(api.tasks.update);
    const deleteTask = useMutation(api.tasks.deleteT); // Using our safe alias
    const toggleComplete = useMutation(api.tasks.toggleComplete);

    const [editingTask, setEditingTask] = useState<any>(null); // Track which task is being edited

    // Filter tasks for this project & separate by columns
    // Note: For a real production app we might do this filtering on backend or use specific queries
    // But client side filtering for a personal app is totally fine and fast.

    const tasks = allTasks?.filter(t => t.projectId === projectId && !t.isCompleted) || [];

    const columns = {
        "High": tasks.filter(t => t.priority === "High"),
        "Medium": tasks.filter(t => t.priority === "Medium"),
        "Low": tasks.filter(t => t.priority === "Low"),
    };

    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement to start drag (prevents accidental drags on clicks)
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeTask = tasks.find(t => t._id === active.id);
        if (!activeTask) return;

        // Find which column we dropped over
        // The 'over' id could be a task ID OR a container ID (if we make columns containers)
        // For simplicity let's rely on finding where the drop happened.

        // Actually a better pattern for simple kanban is to check the container of the 'over' item
        // But here we need to know the target PRIORITY.

        // Let's deduce target priority from the drop target.
        // If dropping over a "column container", use that column's id.
        // If dropping over a "task", use that task's priority.

        let newPriority = null;

        if (["High", "Medium", "Low"].includes(over.id as string)) {
            newPriority = over.id;
        } else {
            const overTask = tasks.find(t => t._id === over.id);
            if (overTask) {
                newPriority = overTask.priority;
            }
        }

        if (newPriority && newPriority !== activeTask.priority) {
            await updateTask({
                id: activeTask._id,
                priority: newPriority as "High" | "Medium" | "Low"
            });
        }
    };

    const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {projectId}
                </h1>
                <div className="flex -space-x-2">
                    {/* Just some fake avocados/users to look cool */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gray-700 flex items-center justify-center text-xs">U{i}</div>
                    ))}
                </div>
            </div>

            {/* Board Columns */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-1 grid grid-cols-3 gap-6 h-full overflow-hidden pb-4">
                    {(["High", "Medium", "Low"] as const).map(priority => (
                        <Column
                            key={priority}
                            id={priority}
                            title={priority}
                            tasks={columns[priority]}
                            onDelete={(id: string) => deleteTask({ id: id as any })}
                            onComplete={(id: string) => toggleComplete({ id: id as any, isCompleted: true })}
                            onTaskClick={(task: any) => setEditingTask(task)}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="opacity-80 rotate-3 scale-105 cursor-grabbing">
                            <TaskCard task={activeTask} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <EditTaskModal
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                task={editingTask}
            />
        </div>
    )
}

function Column({ id, title, tasks, onDelete, onComplete, onTaskClick }: any) {
    const { setNodeRef } = useSortable({
        id: id,
        data: { type: 'Column', id },
        disabled: true
    });

    const colorClass = {
        "High": "bg-red-500",
        "Medium": "bg-yellow-500",
        "Low": "bg-green-500"
    }[title as string];

    return (
        <GlassCard className="flex flex-col h-full bg-slate-900/20">
            {/* Column Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", colorClass)} />
                    <span className="font-semibold text-gray-300">{title}</span>
                    <span className="bg-white/5 text-gray-500 text-xs px-2 py-0.5 rounded-full">{tasks.length}</span>
                </div>
            </div>

            {/* Task List */}
            <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto custom-scrollbar">
                <SortableContext items={tasks.map((t: any) => t._id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task: any) => (
                        <div key={task._id} onClick={() => onTaskClick(task)}>
                            <TaskCard
                                task={task}
                                onDelete={onDelete}
                                onComplete={onComplete}
                            />
                        </div>
                    ))}
                </SortableContext>
                {/* Drop area placeholder if empty */}
                {tasks.length === 0 && (
                    <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-gray-600 text-sm">
                        Drop here
                    </div>
                )}
            </div>
        </GlassCard>
    )
}
