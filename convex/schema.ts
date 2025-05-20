import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  images: defineTable({
    name: v.string(),
    description: v.string(),
    storageId: v.id("_storage"),
  })
    .index("by_storageId", ["storageId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
