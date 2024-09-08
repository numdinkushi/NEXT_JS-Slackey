import { mutation, } from "./_generated/server";
import { v } from "convex/values";

export const storeUserData = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    githubId: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, name, email, image, githubId } = args;

    // Check if the user already exists
    const existingUser = await ctx.db.query("users").filter((q) => q.eq(q.field("githubId"), githubId)).first();

    if (existingUser) {
      // Update the existing user data
      await ctx.db.patch(existingUser._id, {
        name,
        email,
        image,
      });
    } else {
      // Insert a new user
      await ctx.db.insert("users", {
        _id: id,
        name,
        email,
        image,
        githubId,
      });
    }
  },
});
