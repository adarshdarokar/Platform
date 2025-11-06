import {StreamChat, StremaChat} from "stream-chat"

import { ENV } from "./env.js"

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET


if(!apiKey || !apiSecret){
    console.error("stream api is missing")
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async(userData)=>{
    try {
        await chatClient.upsertUser(userData)
        console.log(" stream userted user data successfully:", userData)
    } catch (error) {
        console.error("error upserting Stream user:", error)
    }
}


export const deleteStreamUser = async(userId)=>{
    try {
        await chatClient.deleteUser([userId])
        console.log("stream user deleted successfully:", userId)
    } catch (error) {
        console.error("error deleting Stream user:", error)
    }
}
