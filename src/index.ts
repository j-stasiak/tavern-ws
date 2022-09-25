import dotenv from "dotenv";
dotenv.config();

import { RedisPresence, Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { World } from "./game/World";
import cors from "cors";
import express from "express";
import http from "http";
import { monitor } from "@colyseus/monitor";

const PORT = Number(process.env.PORT) || 4001;
const app = express();

app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const gameServer = new Server({
  transport: new WebSocketTransport({
    server,
  }),
});

gameServer.define("poke_world", World);

app.use("/monitor", monitor());

gameServer.listen(PORT, "0.0.0.0");
console.log(`Listening on ws://localhost:${PORT}`);
