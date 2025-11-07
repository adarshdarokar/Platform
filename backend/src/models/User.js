import mongoose from "mongoose";

// Define the schema for the User collection
const userSchema = mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
    },

    // User's email address (must be unique)
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // Optional profile image URL
    profileImage: {
      type: String,
      default: "",
    },

    // Clerk authentication ID (must be unique for each user)
    clerkId: {
      type: String,
      unique: true,
    },
  },

  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);

export default User;
