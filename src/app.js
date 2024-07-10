import express from "express";
import { loadRoutes } from "./routes/index.js";
import { configDotenv } from "dotenv";

const startServer = async () => {
    const app = express();
    configDotenv({
        path: ".env"
    })
    app.use(express.static("./public"));
    loadRoutes(app);
    app.listen(2000, () => {
        console.log("server run at port 2000");
    })
}

startServer().then((result) => {
    console.log("\nstarted server");
}).catch((err) => {
    console.log(err);
});