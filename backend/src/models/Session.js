import mongoose from "mongoose"

// Define the schema for a coding session
const sessionSchema = new mongoose.Schema({
    // Problem title or name of the question
    problem: {
        type: String,
        required: true
    },

    // Difficulty level of the problem
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },

    // Reference to the host user who created the session
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Reference to the participant user who joined the session (optional)
    participant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

    // Current status of the session (active or completed)
    status: {
        type: String,
        enum: ["active", "completed"],
        default: "active"
    },

    // Call ID used for identifying the video call or session
    callId: {
        type: String,
        default: ""
    }
},
{ timestamps: true } // Automatically adds createdAt and updatedAt fields
)

// Create and export the model for MongoDB
const session = mongoose.model("Session", sessionSchema)
export default session
