import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

// 🧠 Create a new Inngest instance (used for background event processing)
export const inngest = new Inngest({ id: "platform" });

/* 
==========================================
 🧩 Function 1: syncUser
------------------------------------------
📦 Trigger: "clerk/user.created"
🧾 Purpose:
 - Runs when a new user is created in Clerk.
 - Syncs user data to your MongoDB database.
 - Also adds/updates the user in Stream Chat.
==========================================
*/
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // 🔗 Connect to MongoDB
    await connectDB();

    // 🧍 Extract user data from the Clerk event
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    // 🏗️ Prepare user object for MongoDB
    const newUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url,
    };

    //  Save new user to the MongoDB collection
    await User.create(newUser);

    //  Sync user data with Stream Chat
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

/* 
==========================================
 🧩 Function 2: deleteUserFromDB
------------------------------------------
📦 Trigger: "clerk/user.deleted"
🧾 Purpose:
 - Runs when a user is deleted from Clerk.
 - Deletes user record from MongoDB.
 - Also removes user from Stream Chat.
==========================================
*/
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    // 🔗 Connect to MongoDB
    await connectDB();

    // 🧾 Extract the user ID from Clerk event
    const { id } = event.data;

    // ❌ Delete user from MongoDB
    await User.deleteOne({ clerkId: id });

    // ❌ Delete user from Stream Chat
    await deleteStreamUser(id.toString());
  }
);

//  Export all Inngest functions so they can be registered easily
export const functions = [syncUser, deleteUserFromDB];
