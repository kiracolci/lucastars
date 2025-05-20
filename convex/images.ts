import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Mutation to generate a short-lived upload URL
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // NO auth check here
    return await ctx.storage.generateUploadUrl();
  },
});

// Mutation to save image metadata
export const saveImage = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // NO auth check here
    await ctx.db.insert("images", {
      name: args.name,
      description: args.description,
      storageId: args.storageId,
    });
  },
});

// Query to list all images with their URLs
export const listImages = query({
  args: {},
  handler: async (ctx) => {
    const images = await ctx.db.query("images").order("desc").collect();
    return Promise.all(
      images.map(async (image) => ({
        ...image,
        url: await ctx.storage.getUrl(image.storageId),
      }))
    );
  },
});

// Mutation to delete an image
export const deleteImage = mutation({
  args: { imageId: v.id("images") },
  handler: async (ctx, args) => {
    // NO auth check here
    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error("Image not found.");
    }
    // Optional: Delete from storage as well
    // await ctx.storage.delete(image.storageId);
    await ctx.db.delete(args.imageId);
  },
});
