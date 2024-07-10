import axios from "axios";
import { json } from "express";

export async function getChannelId(access_token = "") {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${access_token}`);
    return response.json();
} 