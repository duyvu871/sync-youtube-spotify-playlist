import express,{Router} from "express";
import { authPrams } from "../middlewares/auth.js";
import { getYtPlaylist } from "../controllers/yt.controller.js";

export function loadRoutes(app) {
    if (!app) {
        throw new Error("App instance not provide");
    }
    const router = Router();
    app.use("/", router);
    router.use("/api/get-yt-playlist", authPrams, getYtPlaylist);
}