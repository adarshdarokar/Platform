import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res) {
    try {
        // use clerkId FOR Stream 
        const token = chatClient.createToken(req.user._Id)

        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image
        })
    } catch (error) {
        console.log("error in getStreamToken controller", error.message)
        res.status(500).json({ message: "internal server error"})
    }
}