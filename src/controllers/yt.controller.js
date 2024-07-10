import axios from "axios";
import { getUser, setUser } from "../services/user.service.js";
import { getChannelId } from "../services/yt.services.js";

export async function getYtPlaylist(req, res, next) {
    try {
        const API_ENDPOINT = process.env.YT_API_ENDPOINT || "https://www.googleapis.com/youtube/v3";
        const API_KEY = process.env.YT_API_KEY;
        const access_token = req.query.access_token;
        const userId = req.query.userId;
        const user = (await getUser(userId)).data();
        let channelId = "";
        if (!user) {
            const channel = await getChannelId(access_token);
            // console.log(channel);
            if (!channel) throw new Error("Can not get channel id");
            channelId = channel.items[0].id;
            setUser(userId, {
                ...channel
            });
        } else {
            channelId = user.items[0].id;
        }
        const part = "contentDetails,id,localizations,player,snippet,status";
        const params = {
            part,
            // channelId,
            access_token,
            key: API_KEY,
            maxResults: 50,
            mine: true
        };
        const options = {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }
        // console.log(API_KEY);
        const response = await fetch(`${API_ENDPOINT}/playlists?mine=${params.mine}&part=${params.part}&access_token=${params.access_token}&key=${params.key}&maxResults=${params.maxResults}`, options);
        // console.log(`${API_ENDPOINT}/playlists?&part=${params.part}&channelId=${params.channelId}&access_token=${params.access_token}&key=${params.key}&maxResults=${params.maxResults}`);
        const data = await response.json();
        if (response.status !== 200) {
            res.status(400).json({
                ...data
            });
            return;
        } else {
            res.status(200).json({...data});
        }   
    } catch (e) {
        // console.log(e);
        res.status(500).json({
            message: e.message
        })
    }
}

