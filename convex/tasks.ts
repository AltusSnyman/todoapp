import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks
export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("tasks").collect();
    },
});

// Get stats for Dashboard
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const tasks = await ctx.db.query("tasks").collect();

        const total = tasks.length;
        const completed = tasks.filter(t => t.isCompleted).length;
        const pending = total - completed;
        const highPriority = tasks.filter(t => t.priority === "High" && !t.isCompleted).length;

        const byProject = {
            "System Pros Ai": tasks.filter(t => t.projectId === "System Pros Ai" && !t.isCompleted).length,
            "Skool": tasks.filter(t => t.projectId === "Skool" && !t.isCompleted).length,
            "Social Media": tasks.filter(t => t.projectId === "Social Media" && !t.isCompleted).length,
            "Personal": tasks.filter(t => t.projectId === "Personal" && !t.isCompleted).length,
        };

        return {
            total,
            completed,
            pending,
            highPriority,
            byProject,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    },
});

// Create different mutations
export const create = mutation({
    args: {
        text: v.string(),
        projectId: v.union(
            v.literal("System Pros Ai"),
            v.literal("Skool"),
            v.literal("Social Media"),
            v.literal("Personal")
        ),
        priority: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low")),
        deadline: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("tasks", {
            text: args.text,
            projectId: args.projectId,
            priority: args.priority,
            status: "Todo",
            isCompleted: false,
            deadline: args.deadline,
            order: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("tasks"),
        text: v.optional(v.string()),
        priority: v.optional(v.union(v.literal("High"), v.literal("Medium"), v.literal("Low"))),
        deadline: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;
        await ctx.db.patch(id, fields);
    },
});

export const toggleComplete = mutation({
    args: { id: v.id("tasks"), isCompleted: v.boolean() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            isCompleted: args.isCompleted,
            status: args.isCompleted ? "Done" : "Todo"
        });
    },
});

export const deleteT = mutation({ // 'delete' is reserved in some contexts, but 'deleteT' is safe
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
