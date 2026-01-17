import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks: defineTable({
        text: v.string(),
        description: v.optional(v.string()),
        projectId: v.union(
            v.literal("System Pros Ai"),
            v.literal("Skool"),
            v.literal("Social Media"),
            v.literal("Personal")
        ),
        priority: v.union(v.literal("High"), v.literal("Medium"), v.literal("Low")),
        status: v.union(v.literal("Todo"), v.literal("Done")),
        deadline: v.optional(v.number()), // Unix timestamp
        order: v.optional(v.number()), // For generic ordering if needed
        isCompleted: v.boolean(),
    })
        .index("by_project", ["projectId"])
        .index("by_status", ["status"]),
});
