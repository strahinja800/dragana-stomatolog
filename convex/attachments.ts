import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const listByMedicalRecord = query({
  args: { medicalRecordId: v.id("medicalRecords") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("attachments")
      .withIndex("by_medicalRecordId", (q) =>
        q.eq("medicalRecordId", args.medicalRecordId)
      )
      .order("desc")
      .collect();
  },
});

export const createAttachment = mutation({
  args: {
    medicalRecordId: v.id("medicalRecords"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const attachmentId = await ctx.db.insert("attachments", {
      medicalRecordId: args.medicalRecordId,
      storageId: args.storageId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      description: args.description,
      uploadedAt: Date.now(),
    });
    return attachmentId;
  },
});

export const deleteAttachment = mutation({
  args: { attachmentId: v.id("attachments") },
  handler: async (ctx, args) => {
    const att = await ctx.db.get(args.attachmentId);
    if (!att) return;

    await ctx.storage.delete(att.storageId);
    await ctx.db.delete(args.attachmentId);
  },
});
